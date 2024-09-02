Gin Rummy Frontend
=======================

This repository contains the frontend of a Gin Rummy game, implemented using Vue.js. It interacts with the backend engine to provide a smooth and responsive user interface for playing Gin Rummy online.

Features
--------

*   **User Interface**: A clean and responsive design that adapts to different screen sizes and devices.
*    **Game Interaction**: Allows users to create, add players to, and play Gin Rummy matches, with real-time updates on game state and player actions.
*    **Card Management**: Users can draw, discard, and play cards, as well as manage melds, directly through the interface.
*    **Scoring Visualization**: Displays scores and game progress in an intuitive manner, keeping players informed of their status at all times.
*    **Responsive Design**: Optimized for both desktop and mobile views, ensuring a seamless experience on any device.

Getting Started
---------------

### Prerequisites

*   Node.js 14.x or higher
*   npm (Node Package Manager)
*   Git

### Installation

1.  **Clone the repository**

    ```bash
    git clone git@github.com:your-username/ginrummy-front.git
    cd ginrummy-front
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Configure the environment**

    Create a `.env.local` file in the root directory and set the VUE_APP_BASE_URL to point to the backend engine's URL. e.g.

    ```bash
    echo "VUE_APP_BASE_URL=http://localhost:5000" > .env.local
    ```

4.  **Run the development server**

    ```bash
    npm run serve
    ```

    The application will be accessible at `http://localhost:8080`.


### Deployment

For production deployment, the recommended approach is to use the provided `setup/server_installation.sh` script, which automates the entire process. This script has been tested and is known to work as intended. Follow the steps below:

```bash
cp setup/server_installation.sh ~/setup-front.sh
chmod +x ~/setup-front.sh
~/setup-front.sh
```

This will:

*   Ensure the script is executed with root privileges, as required for system-level configurations.
* Load configuration values (like domain name and base URL) from a configuration file if available or prompt you to input these values, ensuring they meet specific validation criteria.
*   Check if an SSL certificate is already installed for the domain. If not, it will automatically obtain one using Certbot.
*   Generate an SSH key pair if it does not already exist, and assist you in adding it to your GitHub account for secure access to your repositories.
*   Add GitHub's SSH key fingerprints to the known hosts to prevent verification issues during Git operations.
*   Update the server's package lists, upgrade all packages to their latest versions, and install essential software packages, including Python, pip, Git, Nginx, Certbot, npm, and Vue CLI service, and more.
*   Clone or update the ginrummy-front repository from GitHub, and create a `.env.local` file with the base URL configuration.
*   Install Node.js dependencies for the Vue.js application.
*   Create vue.config.js for reverse proxy and HTTPS configuration of the Vue.js development server.
*   Set up a systemd service to run the Vue.js application, ensuring it starts on boot and is properly logged.
*   Set up Nginx as a reverse proxy to manage incoming web traffic, handle SSL termination, and redirect HTTP traffic to HTTPS for improved security.
*   Enable and start the configured services (Nginx and the Vue.js application service).


If you prefer to run `npm run build` to serve a production-ready distribution of the files, that would of course be more performant. However this has not yet been attempted with this project, and you must work it out for yourself.

Game Rules
----------

### Objective

The goal of the game is to accumulate the highest number of points across multiple rounds. You earn points by playing melds and lose points for cards left in your hand at the end of a round.

### Scoring

*   **Ace:** 15 points
*   **10, Jack, Queen, King:** 10 points
*   **2–9:** Points equal to their rank (e.g., 2 is worth 2 points)

### Playing melds

Melds, which are essential for scoring, can only be played starting from a player's second turn in the round. This means no melds can be played during the first turn of any player within a new round.

#### Types of melds
*   **Set:** 3 or 4 cards of the same rank.
*   **Run:** At least 3 consecutive cards of the same suit. Aces can be high or low (e.g., Queen, King, Ace or Ace, 2, 3). However, a run cannot "loop around" (e.g., King, Ace, 2 is not allowed).

### Turn sequence

1.  **Draw a card:**
    *   You must start your turn by drawing a card from either the stock pile or the top of the discard pile. In some cases, you can draw multiple cards from the discard pile. See: [_Special abilities_](#special-abilities).
    *   If the discard pile is empty, you must draw from the stock pile.
    *   If the stock pile is empty, you may either draw from the discard pile or turn the discard pile over to create a new stock pile and draw the top card.
2.  **Play melds:**
    *   After the first rotation, you can play a meld. Once you've played a meld, you gain additional abilities. See: [_Special abilities_](#special-abilities).
3.  **Discard a card:**
    *   End your turn by discarding a card to the top of the discard pile. This is done in a way that keeps all previously discarded cards visible.
    *   If discarding leaves you with no cards in your hand, the round ends.

### Special abilities

Once you have played your first meld in a round, you gain the following special abilities:

#### Extending melds
*   You may add cards to an existing meld to make it larger. This can include adding the fourth card to a set of three or adding any number of consecutive cards to an existing run.
*   You can extend all melds, regardless of who originally played them.
*   You receive points only for the cards you contributed towards a meld.

#### Drawing multiple cards
*   At the start of your turn, you can choose to draw multiple cards from the discard pile.
*   You must nominate at least one of these cards to immediately play as part of a new or extended meld.
*   You may nominate multiple cards from the discard pile, and may also select cards from your own hand, for combined use when playing or extending a meld.
*   Any other cards above the nominated cards are added to your hand, after which you continue your turn as normal.

### End of a round

A round ends only when a player discards their last card. As such, you cannot play cards in a way that leaves you with an empty hand, prior to discarding.

Each remaining player is deducted points equal to the value of the cards still in their hand. This can result in a negative score.

A new round may begin immediately, with the first turn going to the next player clockwise from the one who started the previous round.

Use these rules to strategize your moves and outplay your opponents!

Contributing
------------

Contributions are welcome! Please submit a pull request or open an issue to discuss your ideas.

License
-------

This project is licensed under the MIT License. See the `LICENSE` file for more details.
