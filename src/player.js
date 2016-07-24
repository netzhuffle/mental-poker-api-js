const Config = require('./config');
const BetType = require('./enums/bet-type');
const Utils = require('./utils');

/**
 * A mutable object which represents a player of a game.
 */
class Player {
  /**
   * Public key of the player.
   * @type {string}
   * @member publicKey
   * @memberof Player
   */

  /**
   * Points generated by the player.
   * @type {Point[]}
   * @member points
   * @memberof Player
   */

  /**
   * Secrets of the player. Must be kept hidden from others until the end of the
   * game.
   * @type {BigInt[]}
   * @member secrets
   * @memberof Player
   */

  /**
   * Secret hashes of the player. Used for secret verification at the end of the
   * game.
   * @type {string[]}
   * @member secretHashes
   * @memberof Player
   */

  /**
   * Bets made by the player.
   * @type {Bet[]}
   * @member bets
   * @memberof Player
   */

  /**
   * List of cards which are in the hand of the player.
   * @type {Card[]}
   * @member cardsInHand
   * @memberof Player
   */

  constructor(params) {
    Object.assign(this, params);

    this.points = this.points || [];
    this.secrets = this.secrets || new Array(Config.cardsInDeck + 1);
    this.secretHashes = this.secretHashes || [];
    this.bets = this.bets || [];
    this.cardsInHand = this.cardsInHand || [];

    // Force setting `secretHashes` if all the secrets are known
    if (this.secretHashes.length === 0) {
      let isAllKnown = true;
      for (const secret of this.secrets) {
        if (!secret) {
          isAllKnown = false;
          break;
        }
      }

      if (isAllKnown) {
        this.secretHashes = Utils.getSecretHashes(this.secrets);
      }
    }
  }

  /**
   * Returns true whether the player has folded.
   * @returns {boolean}
   */
  get hasFolded() {
    if (this.bets.length === 0) return false;

    return this.bets[this.bets.length - 1].type === BetType.FOLD;
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
   * Generates random secrets and their corresponding hashes for the player.
   * @returns {Player}
   */
  generateSecrets() {
    this.secrets = Utils.getRandomSecrets();
    this.secretHashes = Utils.getSecretHashes(this.secrets);
    return this;
  }

  /**
   * Verifies the player's secrets against `secretHashes`.
   * @returns {boolean} True whether verification was successful.
   */
  verifySecretsByHashes() {
    const realSecretHashes = Utils.getSecretHashes(this.secrets);

    for (let i = realSecretHashes.length - 1; i >= 0; --i) {
      if (this.secretHashes[i] !== realSecretHashes[i]) {
        return false;
      }
    }

    return true;
  }

  toJSON() {
    return {
      ...(this.publicKey && { publicKey: this.publicKey }),
      ...(this.points.length > 0 && {
        points: this.points.map((point) => ({
          x: point.x.toString(16, 2),
          y: point.y.toString(16, 2),
        })),
      }),
      ...(this.secretHashes.length > 0 && { secretHashes: this.secretHashes }),
    };

    /*
    return Object.assign(
      this.publicKey ? { publicKey: this.publicKey } : {},
      this.points.length > 0 ? {
        points: this.points.map((point) => ({
          x: point.x.toString(16, 2),
          y: point.y.toString(16, 2),
        })),
      } : {},
      this.secretHashes.length > 0 ? { secretHashes: this.secretHashes } : {}
    );
    */
  }
}

module.exports = Player;
