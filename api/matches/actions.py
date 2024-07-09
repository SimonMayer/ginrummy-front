from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import mysql.connector
from utils.config_loader import load_database_config
from utils.database_connector import connect_to_database

def init_match_action_routes(app):
    @app.route('/matches/<int:match_id>/actions/draw_from_stock_pile', methods=['POST'])
    @jwt_required()
    def draw_from_stock_pile(match_id):
        user_id = get_jwt_identity()
        config = load_database_config()
        connection = connect_to_database(config)
        cursor = connection.cursor(buffered=True)

        try:
            # Start a transaction
            connection.start_transaction()

            # Determine the current turn
            cursor.execute("""
                SELECT `t`.`turn_id`, `t`.`user_id`, `t`.`round_id`
                FROM `Turns` `t`
                INNER JOIN `Rounds` `r` ON `t`.`round_id` = `r`.`round_id`
                WHERE `r`.`match_id` = %s AND `t`.`end_time` IS NULL
                FOR UPDATE;
                """,
                (match_id,)
            )
            turn = cursor.fetchone()
            if not turn:
                return jsonify({"error": "No active turn or match does not exist"}), 400
            if turn[1] != user_id:
                return jsonify({"error": "Not the authenticated user's turn"}), 403

            turn_id = turn[0]
            round_id = turn[2]

            # Check if an action of type 'draw' already exists for this turn
            cursor.execute("SELECT `action_id` FROM `Actions` WHERE `turn_id` = %s AND `action_type` = 'draw' FOR UPDATE", (turn_id,))
            if cursor.fetchone():
                return jsonify({"error": "Drawing has already taken place this turn"}), 400

            # Check if the stock pile is empty
            cursor.execute("SELECT `card_id` FROM `Stock_Pile_Cards` WHERE `stock_pile_id` = (SELECT `stock_pile_id` FROM `Stock_Piles` WHERE `round_id` = %s) ORDER BY `sequence` DESC LIMIT 1 FOR UPDATE", (round_id,))
            card = cursor.fetchone()
            if not card:
                return jsonify({"error": "Stock pile is empty"}), 400

            # Get the next sequence number for the user's hand
            cursor.execute("SELECT COALESCE(MAX(`sequence`), 0) + 1 FROM `Hand_Cards` WHERE `hand_id` IN (SELECT `hand_id` FROM `Hands` WHERE `user_id` = %s AND `round_id` = %s) FOR UPDATE", (user_id, round_id))
            next_sequence = cursor.fetchone()[0]

            # Delete the card from the stock pile
            cursor.execute("DELETE FROM `Stock_Pile_Cards` WHERE `card_id` = %s AND `stock_pile_id` = (SELECT `stock_pile_id` FROM `Stock_Piles` WHERE `round_id` = %s)", (card[0], round_id))

            # Add the card to the user's hand
            cursor.execute("INSERT INTO `Hand_Cards` (`hand_id`, `card_id`, `sequence`) SELECT `hand_id`, %s, %s FROM `Hands` WHERE `user_id` = %s AND `round_id` = %s", (card[0], next_sequence, user_id, round_id))

            # Create a new action of type 'draw'
            cursor.execute("INSERT INTO `Actions` (`turn_id`, `action_type`, `full_details`, `public_details`) VALUES (%s, 'draw', CONCAT('drew ', (SELECT `rank` FROM `Cards` WHERE `card_id` = %s), ' ', (SELECT `suit` FROM `Cards` WHERE `card_id` = %s), ' from stock pile'), 'drew 1 card from stock pile')", (turn_id, card[0], card[0]))

            connection.commit()
            return jsonify({"message": "Card drawn successfully", "card_id": card[0]}), 200

        except mysql.connector.Error as err:
            connection.rollback()
            if err.errno == mysql.connector.errorcode.ER_DUP_ENTRY:
                return jsonify({"error": "This card is already in a hand"}), 400
            return jsonify({"error": str(err)}), 500
        finally:
            cursor.close()
            connection.close()
