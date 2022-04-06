/* global Appwrite */

import Logger from "../utils/Logger.js";

const ENDPOINT = "https://appwrite.software-engineering.education/v1",
  PROJECT_ID = "624d5b644e42e8dd7a68",
  SDK = new Appwrite();

class AppwriteService {

  constructor() {
    Logger.log("Creating Appwrite service");
    SDK.setEndpoint(ENDPOINT).setProject(PROJECT_ID);
  }

  /**
   * Trys to connect to the Appwrite server with the given user credentials. Returns a promise,
   * that will resolve to "OK" when user was logged in successfully or "ERROR" if no session could
   * be established. If successfully, the new session will be stored internally.
   * 
   * @param {String} email of the user to be logged in
   * @param {String} password of the user to be logged in
   * @returns A promise, resolved to a status code, describing the success of this request
   */
  async openSession(email, password) {
    try {
      this.session = await SDK.account.createSession(email, password);
      Logger.log(`Opened user session for ${email}`);
      return this.StatusCodes.OK;
    } catch (error) {
      Logger.error(`Error while opening user session for ${email}`);
      return this.StatusCodes.ERROR;
    }
  }

  /**
   * Trys to create a new user on the Appwrite server, using the given credentials. Returns a promise,
   * that will resolve to "OK" when the new user was created successfully or "ERROR" if no user could
   * be created.
   * 
   * @param {String} username of the user to be created
   * @param {String} email of the user to be created
   * @param {String} password of the user to be created
   * @returns 
   */
  async createUser(username, email, password) {
    try {
      let user = await SDK.account.create("unique()", email, password,
        username); // Let Appwrite create a unique ID for this new user
      Logger.log(`Created new user (id = ${user.$id})`);
      return this.StatusCodes.OK;
    } catch (error) {
      Logger.error("Error while creating new user");
      Logger.error(error);
      return this.StatusCodes.ERROR;
    }
  }

  async updateGameState(color, state) {
    Logger.log(`Updating game state`);
    let response, patch = {};
    patch[color] = state;
    response = await SDK.database.updateDocument('624d5c4add1a7bc1bd3c',
      '624d5cf15566cb4f71b1', patch);
    return response;
  }

  async fetchGameState() {
    Logger.log(`Retrieving current game state`);
    let response = await SDK.database.getDocument('624d5c4add1a7bc1bd3c',
      '624d5cf15566cb4f71b1');
    return {
      red: response.red,
      green: response.green,
      blue: response.blue,
    };
  }

  async subscribe(callback) {
    Logger.log(`Subscribing to game state channel`);
    SDK.subscribe("collections.624d5c4add1a7bc1bd3c.documents", response => {
        Logger.log(`Retrieved new game state from subscription`);
      callback({
        red: response.payload.red,
        green: response.payload.green,
        blue: response.payload.blue,
      });
    });
  }

}

AppwriteService.prototype.StatusCodes = {
  OK: "OK",
  ERROR: "ERROR",
};

export default new AppwriteService();