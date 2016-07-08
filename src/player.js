const Config = require('./config');
const Utils = require('./utils');

/**
 * An immutable object which represents a player of a game.
 */
class Player {
  /**
   * Points generated by the player.
   * @type {Point[]}
   * @member points
   * @memberof Player
   */

  /**
   * Secrets of the player. Must be kept hidden from others until the end of
   * the game.
   * @type {BigInt[]}
   * @member secrets
   * @memberof Player
   */

  /**
   * Secret hashes of the player to compare the hashes of real, computed secrets
   * with during verification.
   * @type {string[]}
   * @member secretHashes
   * @memberof Player
   */

  /**
   * List of card IDs which are in the hand of the player.
   * @type {number[]}
   * @member cardsInHand
   * @memberof Player
   */

  constructor({
    points = [],
    secrets = new Array(Config.cardsInDeck),
    secretHashes = [],
    cardsInHand = [],
  } = {}) {
    this.points = points;
    this.secrets = secrets;
    this.secretHashes = secretHashes;
    this.cardsInHand = cardsInHand;
  }

  /**
   * Returns the calculated hashes of the player's secrets.
   * @returns {string[]}
   */
  getSecretHashes() {
    return Utils.getSecretHashes(this.secrets);
  }

  /**
   * Generates random points for the player.
   * @returns {Player}
   */
  generatePoints() {
    this.points = Utils.getRandomPoints();
    return this;
  }

  /**
   * Generates random secrets for the player.
   * @returns {Player}
   */
  generateSecrets() {
    this.secrets = Utils.getRandomSecrets();
    return this;
  }

  /**
   * Verifies the player's secrets using the given array of secret hashes.
   * @param {string[]} [secretHashes] Secret hashes to compare the real,
   * computed secret hashes with. Uses the value of `secretHashes` by default.
   * @returns {boolean} True whether verification was successful.
   */
  verifySecretsByHashes(secretHashes = this.secretHashes) {
    const realSecretHashes = this.getSecretHashes();

    for (let i = realSecretHashes.length - 1; i >= 0; --i) {
      if (secretHashes[i] !== realSecretHashes[i]) {
        return false;
      }
    }

    return true;
  }

  toJSON() {
    return Object.assign(
      { secretHashes: this.getSecretHashes() },
      this.points.length > 0 ?
        { points: this.points } :
        {}
    );
  }
}

module.exports = Player;
