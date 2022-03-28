import * as functions from "firebase-functions";

import * as admin from "firebase-admin";

import * as axios from "axios";

import * as Flutterwave from "flutterwave-node-v3";

import * as Web3 from "web3";
import {Eth} from "web3-eth";
import {Utils, AbiItem} from "web3-utils";

import * as MoralCall from "moralis/node";
const Moralis: any = MoralCall;
// const Moralis = require("moralis/node");

// const MAINNET_URL = "https://speedy-nodes-nyc.moralis.io/5010f4e56176a3b962308c97/bsc/mainnet";
const TESTNET_URL = "https://speedy-nodes-nyc.moralis.io/5010f4e56176a3b962308c97/bsc/testnet";
const web3: Eth = new (Web3 as any)(TESTNET_URL).eth;
const web3Utils: Utils = new (Web3 as any)(TESTNET_URL).utils;
// const Moralis = (moralis as any).default;
// const web3 = Web3(TESTNET_URL);
// import {BncClient} from "@binance-chain/javascript-sdk";

// const api = "https://binance.org/";
// const network = "testnet";
// const bnbClient = new BncClient(TESTNET_URL);
// bnbClient.chooseNetwork("testnet");

// const bnbRPC = new rpc("https://data-seed-prebsc-1-s1.binance.org:8545/", "testnet");

const mths = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

admin.initializeApp();

const FLW_SECRET = "FLWSECK-3eab2853290fcdddbdd574158eb90abc-X";
const FLW_PUBLIC = "FLWPUBK-0d71ee518685d4e82073059eed9deff4-X";
const FLW_BASE_URL = "https://api.flutterwave.com/v3";

const flw = new Flutterwave(FLW_PUBLIC, FLW_SECRET);

const MORALIS_WEB_API_URL = "https://deep-index.moralis.io/api/v2";
const MORALIS_API_KEY = "nXzfwhU9EZQXT8JQWSjxhMOlfOXyEY9PLqpKBdpqSAaDlgCRSZ4SJM7F5GYOTX6l";
const USDT_CONTRACT_ADDRESS = "0x337610d27c682e347c9cd60bd4b3b107c9d34ddd";

// const ADMIN_CONTRACT_WALLET_ADDRESS = "0x3d6A762aEDC6420CC83Fab34073EEcA2d211931b";
// const ADMIN_CONTRACT_WALLET_PRIVATE_KEY = "f21d083d58e9c844ebca2f3d35de6c7d200e59a43e83b10753e8fc7bbb47405c";
const ADMIN_CONTRACT_ADDRESS = "0x6FB283B463efb88e9796eD38a50e8326aF708E60"; // "0xED09fB64826F58EE5A704461c28C3D562a1279E8";

// const ADMIN_PROFIT_WALLET_ADDRESS = "";
// const ADMIN_PROFIT_WALLET_ADDRESS_PRIVATE_KEY = "";

const ADMIN_TRANSACTION_WALLET_ADDRESS = "0x3d6A762aEDC6420CC83Fab34073EEcA2d211931b"; // owner address for contract
const ADMIN_TRANSACTION_WALLET_ADDRESS_PRIVATE_KEY = "f21d083d58e9c844ebca2f3d35de6c7d200e59a43e83b10753e8fc7bbb47405c";


export const flutterwave = functions.https.onRequest(async (request, response) => {
  functions.logger.info(request.body, {structuredData: true});
  functions.logger.info("Query Below", {structuredData: true});
  functions.logger.info(request.query, {structuredData: true});
  // const fr = await freezeToken(1, "0x3d6A762aEDC6420CC83Fab34073EEcA2d211931b", "f21d083d58e9c844ebca2f3d35de6c7d200e59a43e83b10753e8fc7bbb47405c");
  // response.send(fr);
  // response.send({req: request.body, q: request.query, auth: request.headers});
});

export const onUserCreated = functions.firestore.document("/users/{id}").onCreate(async (snapshot, context) => {
  const user = snapshot.data();

  // if (user.hex !== undefined) {
  //   return;
  // }

  const email = user.email;
  const name = user.name;
  const uid = user.id;

  try {
    // await bnbClient.initChain();

    // const newAcct = bnbClient.createAccountWithMneomnic();
    const newAcct = web3.accounts.create();
    const privateKey = newAcct.privateKey;
    const address = newAcct.address;

    // await bnbClient.setPrivateKey(privateKey);
    // const bnbAddress = crypto.getAddressFromPrivateKey(privateKey);
    // const hex = utils.str2hexstring(bnbAddress);
    // const bnbAddress = await bnbClient.getAccount();
    // console.log(bnbAddress?.result);

    await admin.firestore().collection("users").doc(uid).update({
      "privateKey": privateKey,
      "address": address,
    });

    await admin.firestore().collection("users").doc(uid).collection("wallet").doc("ngn-wallet").set({
      "total-amount": 0,
      "frozen-amount": 0,
    });

    await admin.firestore().collection("users").doc(uid).collection("wallet").doc("usdt-wallet").set({
      "total-amount": 0,
      "frozen-amount": 0,
    });

    // Moralis.authenticate({
    //   email: user.email,
    //   apiKey: "",
    //   network: "bsc testnet",
    //   privateKey: privateKey
    // })

    // Moralis.link(address)


    const subject = "WELCOME TO CRYPTO PEER";
    const content = `Hi ${name.split(" ")[0]}, <br>
                    Thank you for coming on-board with us.<br><br>
                    Below are your crypto wallet information. Please do not share your <strong>private key</strong> with anyone and keep this safe, because this information cannot be retrieved once lost.<br><br>
                    Wallet Address: ${address}<br><br>
                    Private Key: ${privateKey}<br><br>
                    Regards.`;
    await sendGeneralEmail(email, subject, content);
  } catch (err) {
    console.log(err);
  }
});

export const onWalletUpdated = functions.firestore.document("/users/{id}/wallet/{walletId}").onUpdate(async (snapshot, context) => {
  const data = snapshot.after.data();

  const totalAmount = data["total-amount"];
  const frozenAmount = data["frozen-amount"];

  if (totalAmount < 0) {
    snapshot.after.ref.update({
      "total-amount": 0,
    });
  }

  if (frozenAmount < 0) {
    snapshot.after.ref.update({
      "frozen-amount": 0,
    });
  }
});

export const onOrderCreated = functions.firestore.document("/p2p-orders/{id}").onCreate(async (snapshot, context) => {
  const data = snapshot.data();
  let emailSubject = "";
  let emailContent = "";

  const uid = data.created_by.user_id;
  if (uid === undefined) {
    emailSubject = "P2P ORDER STATUS UPDATE";
    emailContent = `Your P2P Order, ${data.order_id} cannot be processed because your user id is invalid`;
    await sendGeneralEmail(data.created_by.email, emailSubject, emailContent);
    return;
  }

  // get user data
  const queryUser = await admin.firestore().collection("users").doc(`${uid}`).get();
  if (!queryUser.exists) {
    emailSubject = "P2P ORDER STATUS UPDATE";
    emailContent = `Your P2P Order, ${data.order_id} cannot be processed because your user id is invalid`;
    await sendGeneralEmail(data.created_by.email, emailSubject, emailContent);
    return;
  }
  const userData = queryUser.data();
  if (userData === undefined) {
    emailSubject = "P2P ORDER STATUS UPDATE";
    emailContent = `Your P2P Order, ${data.order_id} cannot be processed because your user id is invalid`;
    await sendGeneralEmail(data.created_by.email, emailSubject, emailContent);
    return;
  }

  // check user account balance for usdt or ngn first and confirm with the uploaded data
  try {
    if (data.order_type === "buy") {
      // get wallet data
      const userWallet = await admin.firestore().collection("users").doc(data.created_by.user_id).collection("wallet").doc("ngn-wallet").get();
      const walletData = userWallet.data() ?? {};
      const totalAmt = walletData["total-amount"];
      if (data.total_amount > totalAmt) {
        emailSubject = "P2P ORDER STATUS UPDATE";
        emailContent = `Your P2P Order, ${data.order_id} cannot be processed because your wallet balance is not sufficient to perform this order. Please update your order from your dashboard.`;
        await sendGeneralEmail(data.created_by.email, emailSubject, emailContent);
        return;
      }
      // update frozen and total
      const newTotalAmt = data.total_amount * -1;
      await admin.firestore().collection("users").doc(data.created_by.user_id).collection("wallet").doc("ngn-wallet").update({
        "total-amount": admin.firestore.FieldValue.increment(newTotalAmt),
        "frozen-amount": admin.firestore.FieldValue.increment(data.total_amount),
      });

      await admin.firestore().collection("p2p-orders").doc(data.id).update({
        "status": "approved",
      });
      emailSubject = "P2P ORDER STATUS UPDATE";
      emailContent = `Your P2P Order, ${data.order_id} has been approved.`;
      await sendGeneralEmail(data.created_by.email, emailSubject, emailContent);
      return;
    }
    const address = userData.address;
    const _header = {
      "X-API-Key": MORALIS_API_KEY,
    };
    // get token balances for address
    const tokenReq = await axios.default.get(`${MORALIS_WEB_API_URL}/${address}/erc20?chain=bsc testnet`, {headers: _header});
    const tokens:any[] = tokenReq.data;

    const usdt = tokens.find((val, ind, arr) => {
      return val.symbol === "USDT";
    });
    const usdtBal = (usdt.balance / (Math.pow(10, usdt.decimals)));
    if (data.total_amount > usdtBal) {
      emailSubject = "P2P ORDER STATUS UPDATE";
      emailContent = `Your P2P Order, ${data.order_id} cannot be processed because your wallet balance is not sufficient to perform this order. Please update your order from your dashboard.`;
      await sendGeneralEmail(data.created_by.email, emailSubject, emailContent);
      return;
    }

    // freeze the total amount
    // reduce allowance to zero
    // update address approved amount
    const freeze = await freezeToken(data.total_amount, userData.privateKey, userData.address);
    console.log(freeze);
    if (freeze["status"]) {
      // update frozen and total
      await admin.firestore().collection("users").doc(data.created_by.user_id).collection("wallet").doc("usdt-wallet").update({
        "frozen-amount": admin.firestore.FieldValue.increment(data.total_amount), // minus transaction fee
      });

      // update status
      await admin.firestore().collection("p2p-orders").doc(data.id).update({
        "status": "approved",
      });
      emailSubject = "P2P ORDER STATUS UPDATE";
      emailContent = `Your P2P Order, ${data.order_id} has been approved.`;
      await sendGeneralEmail(data.created_by.email, emailSubject, emailContent);
      return;
    }
  } catch (err) {
    emailSubject = "P2P ORDER STATUS UPDATE";
    emailContent = `Your P2P Order, ${data.order_id} cannot be processed because:\n\n${err}`;
    await sendGeneralEmail(data.created_by.email, emailSubject, emailContent);
  }
});

export const onOrderUpdated = functions.firestore.document("/p2p-orders/{id}").onUpdate(async (snapshot, context) => {
  // await freezeToken(0, "", "", "");
  console.log("hello");
});

export const onOrderDeleted = functions.firestore.document("/p2p-orders/{id}").onDelete(async (snapshot, context) => {
  let emailSubject = "";
  let emailContent = "";
  const data = snapshot.data();

  const totalAmt = data.total_amount;
  const uid = data.created_by.user_id;
  const orderType = data.order_type;

  if (uid === undefined) {
    // emailSubject = "P2P ORDER STATUS UPDATE";
    // emailContent = `Your P2P Order, ${data.order_id} cannot be processed because your user id is invalid`;
    // await sendGeneralEmail(data.created_by.email, emailSubject, emailContent);
    return;
  }

  // get user data
  const queryUser = await admin.firestore().collection("users").doc(`${uid}`).get();
  if (!queryUser.exists) {
    // emailSubject = "P2P ORDER STATUS UPDATE";
    // emailContent = `Your P2P Order, ${data.order_id} cannot be processed because your user id is invalid`;
    // await sendGeneralEmail(data.created_by.email, emailSubject, emailContent);
    return;
  }
  const userData = queryUser.data();
  if (userData === undefined) {
    // emailSubject = "P2P ORDER STATUS UPDATE";
    // emailContent = `Your P2P Order, ${data.order_id} cannot be processed because your user id is invalid`;
    // await sendGeneralEmail(data.created_by.email, emailSubject, emailContent);
    return;
  }


  if ((totalAmt > 0 && data.status === "expired") || (totalAmt > 0 && data.status === "approved")) {
    const newAmt = totalAmt * -1;
    if (orderType === "sell") {
      const unfreeze = await unfreezeToken(totalAmt, userData.address);
      if (unfreeze.status) {
        await admin.firestore().collection("users").doc(uid).collection("wallet").doc("usdt-wallet").update({
          "frozen-amount": admin.firestore.FieldValue.increment(newAmt),
        });
        emailSubject = "P2P ORDER DELETE STATUS";
        emailContent = `Your P2P Order, ${data.order_id} has been deleted successfully.\n\n ${totalAmt} USDT has been moved from your locked wallet to your active wallet.`;
      }
    } else { // order = buy
      await admin.firestore().collection("users").doc(`${uid}`).collection("wallet").doc("ngn-wallet").update({
        "total-amount": admin.firestore.FieldValue.increment(totalAmt),
        "frozen-amount": admin.firestore.FieldValue.increment(newAmt),
      });
      emailSubject = "P2P ORDER DELETE STATUS";
      emailContent = `Your P2P Order, ${data.order_id} has been deleted successfully.\n\n NGN ${totalAmt} has been moved from your locked wallet to your active wallet.`;
    }
    await sendGeneralEmail(data.created_by.email, emailSubject, emailContent);
  }
});

export const onTradeCreated = functions.firestore.document("/trades/{id}").onCreate(async (snapshot, context) => {
  const data = snapshot.data();

  // get creator data
  const creatorUid = data.send_creator.uid;
  if (creatorUid === undefined) {
    return;
  }

  // get user data
  const queryCreatorUser = await admin.firestore().collection("users").doc(`${creatorUid}`).get();
  if (!queryCreatorUser.exists) {
    return;
  }
  const creatorUserData = queryCreatorUser.data();
  if (creatorUserData === undefined) {
    return;
  }

  // get guest data
  const guestUid = data.send_guest.uid;
  if (guestUid === undefined) {
    return;
  }

  // get user data
  const queryGuestUser = await admin.firestore().collection("users").doc(`${guestUid}`).get();
  if (!queryGuestUser.exists) {
    return;
  }
  const guestUserData = queryGuestUser.data();
  if (guestUserData === undefined) {
    return;
  }

  try {
    if (data.listed_as === "buy") {
    // send creator ngn and debit guest ngn

      // send guest token from creator -- const sendGuestTokenFromCreator =
      const gtrf = await transferTokenBuy(data.send_guest.amount, guestUserData.address);
      console.log(gtrf);

      if (!gtrf.status) {
        await admin.firestore().collection("p2p-orders").doc(data.p2p_id).update({
          "is_user_ordering": false,
          "updated_by": "trade-system",
        });
        const emailSubject = "P2P TRADE STATUS UPDATE";
        const emailContent = `Your trade order cannot be processed because:\n\n${gtrf.message}`;
        await sendGeneralEmail(guestUserData.email, emailSubject, emailContent);
        return;
      }

      // send creator ngn
      await admin.firestore().collection("users").doc(creatorUid).collection("wallet").doc("ngn-wallet").update({
        "total-amount": admin.firestore.FieldValue.increment(data.send_creator.amount),
      });

      // deduct ngn from guest
      const deductAmount = data.send_creator.amount * -1;
      await admin.firestore().collection("users").doc(guestUid).collection("wallet").doc("ngn-wallet").update({
        "total-amount": admin.firestore.FieldValue.increment(deductAmount),
      });

      // deduct token amount from creator
      const newTokenAmt = data.send_guest.amount * -1;
      await admin.firestore().collection("users").doc(creatorUid).collection("wallet").doc("usdt-wallet").update({
        "frozen-amount": admin.firestore.FieldValue.increment(newTokenAmt),
      });

      // update p2p data;
      const p2pData = await admin.firestore().collection("p2p-orders").doc(data.p2p_id).get();
      const pData = p2pData.data();
      if (pData === undefined) {
        return;
      }
      const pTotal = pData.total_amount;
      const pMin = pData.order_limit_min;

      const newPTotal = pTotal - data.send_guest.amount; // same as max

      await admin.firestore().collection("p2p-orders").doc(data.p2p_id).update({
        "total_amount": newPTotal,
        "order_limit_max": newPTotal,
        "order_limit_min": (newPTotal < pMin) ? 1 : pMin, // (newPTotal < pMin) ? (pMin) : pMin,
        "status": (newPTotal <= 0) ? "expired" : pData.status,
        "is_user_ordering": newPTotal > 0 ? false : true,
        "updated_by": "trade-system",
      });

      // record order transaction for creator
      const creatorKey = admin.firestore().collection("p2p-transactions").doc().id;
      const creatorTransData = {
        id: creatorKey,
        received: {
          currency: data.send_creator.currency,
          local: data.send_creator.local,
          amount: data.send_creator.amount,
        },
        sent: {
          currency: data.send_guest.currency,
          local: data.send_guest.local,
          amount: data.send_guest.amount,
        },
        p2p_id: data.p2p_id,
        order_price: data.price,
        listed_as: data.listed_as,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        created_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
        created_by: {
          user_id: creatorUid,
          email: creatorUserData.email,
          name: creatorUserData.name,
          msgId: creatorUserData.msgID,
          image: creatorUserData.image,
          number: creatorUserData.phone_number,
        },
        year: new Date().getFullYear(),
        month: mths[new Date().getMonth()],
        day: new Date().getDate(),
      };
      await admin.firestore().collection("p2p-transactions").doc(creatorKey).set(creatorTransData);

      const guestKey = admin.firestore().collection("p2p-transactions").doc().id;
      const guestTransData = {
        id: guestKey,
        received: {
          currency: data.send_guest.currency,
          local: data.send_guest.local,
          amount: data.send_guest.amount,
        },
        sent: {
          currency: data.send_creator.currency,
          local: data.send_creator.local,
          amount: data.send_creator.amount,
        },
        p2p_id: data.p2p_id,
        order_price: data.price,
        listed_as: data.listed_as,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        created_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
        created_by: {
          user_id: guestUid,
          email: guestUserData.email,
          name: guestUserData.name,
          msgId: guestUserData.msgID,
          image: guestUserData.image,
          number: guestUserData.phone_number,
        },
        year: new Date().getFullYear(),
        month: mths[new Date().getMonth()],
        day: new Date().getDate(),
      };
      await admin.firestore().collection("p2p-transactions").doc(guestKey).set(guestTransData);

      // send creator email
      const cSubject = "P2P TRADE CONFIRMATION";
      const cContent = `<strong>NGN ${data.send_creator.amount}</strong> has successfully been transferred to your NGN Wallet which is equivalent to ${data.send_guest.amount} ${data.send_guest.currency}.<br><br>Check your dashboard for your transaction details.`;
      await sendGeneralEmail(creatorUserData.email, cSubject, cContent);

      // send guest email
      const gSubject = "P2P TRADE CONFIRMATION";
      const gContent = `<strong>${data.send_guest.amount} ${data.send_guest.currency}</strong> has successfully been transferred to your ${data.send_guest.currency} Wallet which is equivalent to <strong>NGN ${data.send_creator.amount}</strong>.<br><br>Check your dashboard for your transaction details.`;
      await sendGeneralEmail(guestUserData.email, gSubject, gContent);

      // delete trade data
      await admin.firestore().collection("trades").doc(data.id).delete();
    } else {
    // send guest ngn and debit creator ngn

      // send creator token from guest
      const trf = await transferTokenSell(data.send_creator.amount, guestUserData.privateKey, guestUserData.address, creatorUserData.address);
      console.log(trf);
      if (!trf.status) {
        await admin.firestore().collection("p2p-orders").doc(data.p2p_id).update({
          "is_user_ordering": false,
          "updated_by": "trade-system",
        });
        const emailSubject = "P2P TRADE STATUS UPDATE";
        const emailContent = `Your trade order cannot be processed because:\n\n${trf.message}`;
        await sendGeneralEmail(guestUserData.email, emailSubject, emailContent);
        return;
      }

      // send guest ngn
      await admin.firestore().collection("users").doc(guestUid).collection("wallet").doc("ngn-wallet").update({
        "total-amount": admin.firestore.FieldValue.increment(data.send_guest.amount),
      });

      // deduct ngn from creator
      const deductAmount = data.send_guest.amount * -1;
      await admin.firestore().collection("users").doc(creatorUid).collection("wallet").doc("ngn-wallet").update({
        "total-amount": admin.firestore.FieldValue.increment(deductAmount),
      });

      // deduct token amount from guest
      // const newTokenAmt = data.send_creator.amount * -1;
      // await admin.firestore().collection("users").doc(guestUid).collection("wallet").doc("usdt-wallet").update({
      //   "frozen-amount": admin.firestore.FieldValue.increment(newTokenAmt),
      // });

      // update p2p data;
      const p2pData = await admin.firestore().collection("p2p-orders").doc(data.p2p_id).get();
      const pData = p2pData.data();
      if (pData === undefined) {
        return;
      }
      const pTotal = pData.total_amount;
      const pMin = pData.order_limit_min;

      const newPTotal = pTotal - data.send_guest.amount; // same as max

      await admin.firestore().collection("p2p-orders").doc(data.p2p_id).update({
        "total_amount": newPTotal,
        "order_limit_max": newPTotal,
        "order_limit_min": (newPTotal <= 0) ? 0 : pMin, // (newPTotal < pMin) ? (pMin) : pMin,
        "status": (newPTotal <= 0) ? "expired" : pData.status,
        "is_user_ordering": newPTotal > 0 ? false : true,
        "updated_by": "trade-system",
      });

      // record order transaction for creator
      const creatorKey = admin.firestore().collection("p2p-transactions").doc().id;
      const creatorTransData = {
        id: creatorKey,
        received: {
          currency: data.send_creator.currency,
          amount: data.send_creator.amount,
        },
        sent: {
          currency: data.send_guest.currency,
          amount: data.send_guest.amount,
        },
        order_price: data.price,
        p2p_id: data.p2p_id,
        listed_as: data.listed_as,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        created_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
        created_by: {
          user_id: creatorUid,
          email: creatorUserData.email,
          name: creatorUserData.name,
          msgId: creatorUserData.msgID,
          image: creatorUserData.image,
          number: creatorUserData.phone_number,
        },
        year: new Date().getFullYear(),
        month: mths[new Date().getMonth()],
        day: new Date().getDate(),
      };
      await admin.firestore().collection("p2p-transactions").doc(creatorKey).set(creatorTransData);

      const guestKey = admin.firestore().collection("p2p-transactions").doc().id;
      const guestTransData = {
        id: guestKey,
        received: {
          currency: data.send_guest.currency,
          amount: data.send_guest.amount,
        },
        sent: {
          currency: data.send_creator.currency,
          amount: data.send_creator.amount,
        },
        p2p_id: data.p2p_id,
        listed_as: data.listed_as,
        order_price: data.price,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        created_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
        created_by: {
          user_id: guestUid,
          email: guestUserData.email,
          name: guestUserData.name,
          msgId: guestUserData.msgID,
          image: guestUserData.image,
          number: guestUserData.phone_number,
        },
        year: new Date().getFullYear(),
        month: mths[new Date().getMonth()],
        day: new Date().getDate(),
      };
      await admin.firestore().collection("p2p-transactions").doc(guestKey).set(guestTransData);

      // send guest email
      const gSubject = "P2P TRADE CONFIRMATION";
      const gContent = `<strong>NGN ${data.send_guest.amount}</strong> has successfully been transferred to your NGN Wallet which is equivalent to ${data.send_creator.amount} ${data.send_creator.currency}.<br><br>Check your dashboard for your transaction details.`;
      await sendGeneralEmail(guestUserData.email, gSubject, gContent);

      // send creator email
      const cSubject = "P2P TRADE CONFIRMATION";
      const cContent = `<strong>${data.send_creator.amount} ${data.send_creator.currency}</strong> has successfully been transferred to your ${data.send_creator.currency} Wallet which is equivalent to <strong>NGN ${data.send_guest.amount}</strong>.<br><br>Check your dashboard for your transaction details.`;
      await sendGeneralEmail(creatorUserData.email, cSubject, cContent);

      // delete trade data
      await admin.firestore().collection("trades").doc(data.id).delete();
    }
  } catch (err) {
    await admin.firestore().collection("p2p-orders").doc(data.p2p_id).update({
      "is_user_ordering": false,
      "updated_by": "trade-system",
    });
    const emailSubject = "P2P TRADE STATUS UPDATE";
    const emailContent = `Your trade order cannot be processed because:\n\n${err}`;
    await sendGeneralEmail(data.created_by.email, emailSubject, emailContent);
  }
});

export const getwalletbalance = functions.https.onRequest(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  const uid = request.query.uid;

  if (uid === undefined) {
    response.send({"error": true, "message": "Invalid query parameters."});
    return;
  }

  // get user data
  const queryUser = await admin.firestore().collection("users").doc(`${uid}`).get();
  if (!queryUser.exists) {
    response.send({"error": true, "message": "User does not exist."});
    return;
  }
  const userData = queryUser.data();
  if (userData === undefined) {
    response.send({"error": true, "message": "User does not exist."});
    return;
  }

  try {
    const address = userData.address;

    // await bnbClient.initChain();
    // await bnbClient.setPrivateKey(userData.privateKey);

    // const bnbBal = await bnbRPC.getBalance(address, "BNB");
    // const usdtBal = await bnbRPC.getBalance(address, "USDT");

    // const bals = await bnbRPC.getBalances(address);

    // const accts = await bnbRPC.getAccount(address);

    // const mint = await bnbClient.tokens.mint(address, "BNB", 0.02);
    // const bnbBal = await bnbClient.getBalance(address);
    const bal = await web3.getBalance(address);

    const _header = {
      "X-API-Key": MORALIS_API_KEY,
    };

    // test transfer token
    // const data = contract.methods.transfer("0x3d6A762aEDC6420CC83Fab34073EEcA2d211931b", amount).send({from: address}).encodeABI();
    // const txObj: TransactionConfig = {
    //   "to": "0x3d6A762aEDC6420CC83Fab34073EEcA2d211931b",
    //   "data": data,
    //   "from": address,
    //   "gas": 5000000,
    //   "gasPrice": gasP,
    // };
    // web3.accounts.signTransaction(txObj, userData.privateKey, (err, signedTx) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log(signedTx);
    //     if (signedTx === undefined) {
    //       return;
    //     }
    //     web3.sendSignedTransaction(`${signedTx.rawTransaction}`, (err, res) => {
    //       console.log(err, res);
    //     });
    //   }
    // });


    // const getChainId = await web3.getChainId();
    // const getNonce = await web3.getTransactionCount(address);
    // web3.sendTransaction({
    //   from: address,
    //   to: "0x3d6A762aEDC6420CC83Fab34073EEcA2d211931b",
    //   value: web3Utils.toWei(web3Utils.toBN("5"), "ether"),
    //   chainId: getChainId,
    //   nonce: getNonce,
    // })

    // get token balances for address
    const tokenReq = await axios.default.get(`${MORALIS_WEB_API_URL}/${address}/erc20?chain=bsc testnet`, {headers: _header});


    // const options: Moralis.TransferOptions = {
    //   type: "erc20",
    //   amount: Moralis.Units.Token("5", 18) ?? "",
    //   receiver: "0x3d6A762aEDC6420CC83Fab34073EEcA2d211931b",
    //   contractAddress: USDT_CONTRACT_ADDRESS,
    //   system: "evm",
    // }
    // Moralis.addNetwork(Moralis.Chains.BSC_TESTNET, "bsc testnet", "Binance", "BNB", TESTNET_URL, "");
    // Moralis.transfer(options)

    response.send({"status": true, "native": web3Utils.fromWei(bal), "tokens": tokenReq.data});
  } catch (err) {
    console.log(err);
  }
});

export const verifyaccount = functions.https.onRequest(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  const bank = request.query.bank;
  const account = request.query.account;

  if (bank === undefined || account === undefined) {
    response.send({"error": true, "message": "Invalid query parameters."});
    return;
  }

  const payload = {
    "account_number": account,
    "account_bank": bank,
  };
  const res = await flw.Misc.verify_Account(payload);
  if (res["status"] === "success") {
    response.send({"status": true, "data": res["data"]});
  } else {
    response.send({"error": true, "message": "Invalid query parameters."});
  }
});

export const withdrawfunds = functions.https.onRequest(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  const uid = request.query.uid;
  const accountBank = request.query.account_bank;
  const accountNumber = request.query.account_number;
  const amt = request.query.amount;
  const fee = request.query.fee;

  if (uid === undefined || accountBank === undefined || accountNumber === undefined || amt === undefined || fee === undefined) {
    response.send({"error": true, "message": "Invalid query parameters."});
    return;
  }

  // get user data
  const queryUser = await admin.firestore().collection("users").doc(`${uid}`).get();
  if (!queryUser.exists) {
    response.send({"error": true, "message": "User does not exist."});
    return;
  }
  const userData = queryUser.data();
  if (userData === undefined) {
    response.send({"error": true, "message": "User does not exist."});
    return;
  }

  // check if user has this bank saved.
  const checkIfBankExist = await admin.firestore().collection("users").doc(`${uid}`).collection("banks").where("bank_code", "==", accountBank).get();
  if (checkIfBankExist.empty) {
    response.send({"error": true, "message": "Bank does not belong to user."});
    return;
  }

  // check user wallet ngn balance
  const checkNgnBalance = await admin.firestore().collection("users").doc(`${uid}`).collection("wallet").doc("ngn-wallet").get();
  if (!checkNgnBalance.exists) {
    response.send({"error": true, "message": "Insufficient account balance."});
    return;
  }
  const balData = checkNgnBalance.data();
  if (balData === undefined) {
    response.send({"error": true, "message": "Insufficient account balance."});
    return;
  }
  const ngnBalance = balData["total-amount"];
  const totalTransferAmt = Number(amt) + Number(fee);

  if (totalTransferAmt > ngnBalance) {
    response.send({"error": true, "message": "Insufficient account balance."});
    return;
  }

  const key = admin.firestore().collection("transactions").doc().id;

  const payload = {
    "account_bank": accountBank,
    "account_number": accountNumber,
    "amount": Number(amt),
    "narration": `${uid}|${key}`,
    "currency": "NGN",
    "reference": new Date().getTime().toString(),
    "callback_url": "",
    "debit_currency": "NGN",
  };

  const res = await flw.Transfer.initiate(payload);
  if (res["status"] === "success") {
    const resData = res["data"];

    const transaction = {
      id: key,
      flutterwave_data: resData,
      transaction_type: "withdraw_ngn", // withdraw_ngn, funded_ngn, receive_usdt, send_usdt
      token: "NGN", // USDT,NGN
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      created_date: `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`,
      created_by: {
        user_id: uid,
        email: userData.email,
        name: userData.name,
        msgId: userData.msgID,
        image: userData.image,
        number: userData.phone_number,
      },
      status: "processing",
      year: new Date().getFullYear(),
      month: mths[new Date().getMonth()],
      day: new Date().getDate(),
    };

    await admin.firestore().collection("transactions").doc(key).set(transaction);

    // update balance
    const reducedAmount = (Number(amt) + Number(fee)) * -1;

    await admin.firestore().collection("users").doc(`${uid}`).collection("wallet").doc("ngn-wallet").update({
      "total-amount": admin.firestore.FieldValue.increment(reducedAmount),
    });
    response.send({"status": true, "message": "Transfer successful."});
  } else {
    response.send({"error": true, "message": "Transfer failed. Please try again.", "res": res});
  }
});

export const fectchtransfersfee = functions.https.onRequest(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  const amt = request.query.amount;

  if (amt === undefined) {
    response.send({"error": true, "message": "Please specify amount to transfer."});
    return;
  }


  const _header = {
    "Authorization": `Bearer ${FLW_SECRET}`,
  };

  const query = await axios.default.get(`${FLW_BASE_URL}/transfers/fee?amount=${amt}&currency=NGN`, {headers: _header});

  if (query.data === undefined) {
    response.send({"error": true, "message": "Please specify amount to transfer."});
    return;
  }

  const dt = query.data;
  if (dt["status"] === "success") {
    response.send({"status": true, "data": dt["data"]});
  } else {
    response.send({"error": true, "message": "Please specify amount to transfer."});
  }
});

export const getnigeriabanks = functions.https.onRequest(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");


  const _header = {
    "Authorization": `Bearer ${FLW_SECRET}`,
  };

  const query = await axios.default.get(`${FLW_BASE_URL}/banks/NG`, {headers: _header});

  if (query.data === undefined) {
    response.send({"error": true, "message": "Could not fetch banks"});
    return;
  }

  const dt = query.data;
  if (dt["status"] === "success") {
    response.send({"status": true, "data": dt["data"]});
  } else {
    response.send({"error": true, "message": "Could not fetch banks"});
  }
});

export const changeorderstatus = functions.https.onRequest(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  try {
    const getChainId = await web3.getChainId();
    await Moralis.start({masterKey: "IyhtQ4nkcXwlUug7bZ61BpnRbqBq7tu6z2iR6LUD", serverUrl: "https://abxgkddrkb9c.usemoralis.com:2053/server", appId: "cG3PkW2sY6runEuBktncGQbPmvVBOJoKB00kTE7i"});
    await Moralis.enableWeb3({
      chainId: getChainId,
      privateKey: "92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e",
    });
    const options = {
      type: "erc20",
      amount: Moralis.Units.Token("1", 18),
      receiver: "0x92cd6cB788AA8db7AD42e5160fb7cf52f4576D66",
      contractAddress: USDT_CONTRACT_ADDRESS,
    };
    const result = await Moralis.transfer(options);
    console.log(result);
    response.send(result);
  } catch (err) {
    console.log(err);
    response.send({"error": true, "err": `${err}`, "type": typeof(Moralis)});
  }

  return;

  const orderId = request.query.order_id;
  const p2pID = request.query.id;
  const value = request.query.value;

  if (p2pID === undefined || value === undefined || orderId === undefined) {
    response.send({"error": true});
    return;
  }

  await admin.firestore().collection("p2p-orders").doc(`${p2pID}`).update({
    "is_user_ordering": value === "true" ? true : false,
  });
  response.send({"status": true});
});

async function freezeToken(amount: any, privateKey: any, address: any) {
  web3.accounts.wallet.add(privateKey); // ADMIN_TRANSACTION_WALLET_ADDRESS_PRIVATE_KEY);
  const gasP = await web3.getGasPrice();
  const contract = new web3.Contract(minABI, USDT_CONTRACT_ADDRESS, {gas: 3000000, gasPrice: gasP});
  // const contract = new web3.Contract(adminABI, ADMIN_CONTRACT_ADDRESS, {gas: 3000000, gasPrice: gasP});
  // const amt = web3Utils.toWei(web3Utils.toBN(amount), "ether");
  const amt = web3Utils.toWei(`${amount}`, "ether");
  const res = await contract.methods.transfer(ADMIN_CONTRACT_ADDRESS, amt).send({from: address});
  return res;
  // let returnResponse = {};
  // await bnbClient.setPrivateKey(privateKey);
  // await bnbClient.initChain();
  // if (action === "freeze") {
  //   const freezeRes = await bnbClient.tokens.freeze(fromAddr, asset, amount);
  //   if (freezeRes.status === 200) {
  //     returnResponse = {"status": true, "result": freezeRes.result[0].hash};
  //     console.log("success", freezeRes.result[0].hash);
  //   } else {
  //     returnResponse = {"status": false, "result": freezeRes};
  //     console.error("error", freezeRes);
  //   }
  //   return returnResponse;
  // } else {
  //   const unfreezeRes = await bnbClient.tokens.unfreeze(fromAddr, asset, amount);
  //   if (unfreezeRes.status === 200) {
  //     returnResponse = {"status": true, "result": unfreezeRes.result[0].hash};
  //     console.log("success", unfreezeRes.result[0].hash);
  //   } else {
  //     returnResponse = {"status": false, "result": unfreezeRes};
  //     console.error("error", unfreezeRes);
  //   }
  //   return returnResponse;
  // }
}

async function unfreezeToken(amount: any, toAddr: any) {
  console.log(`amt == ${amount}`);
  web3.accounts.wallet.add(ADMIN_TRANSACTION_WALLET_ADDRESS_PRIVATE_KEY);
  const gasP = await web3.getGasPrice();
  const contract = new web3.Contract(adminABI, ADMIN_CONTRACT_ADDRESS, {gas: 3000000, gasPrice: gasP});
  // const amt = web3Utils.toWei(web3Utils.toBN(amount), "ether");
  const amt = amount * Math.pow(10, 18); // web3Utils.toWei(`${amount}`, "ether");
  console.log(amt);
  const res = await contract.methods.transferERC20(USDT_CONTRACT_ADDRESS, toAddr, `${amt}`).send({from: ADMIN_TRANSACTION_WALLET_ADDRESS});
  return res;
}

async function transferTokenBuy(amount: any, toAddr: any) {
  web3.accounts.wallet.add(ADMIN_TRANSACTION_WALLET_ADDRESS_PRIVATE_KEY); // "0x3d6A762aEDC6420CC83Fab34073EEcA2d211931b"
  const gasP = await web3.getGasPrice();
  // const contract = new web3.Contract(minABI, USDT_CONTRACT_ADDRESS, {gas: 5000000, gasPrice: gasP});
  const contract = new web3.Contract(adminABI, ADMIN_CONTRACT_ADDRESS, {gas: 3000000, gasPrice: gasP});
  // const amt = web3Utils.toWei(web3Utils.toBN(amount), "ether");
  const amt = amount * Math.pow(10, 18); // web3Utils.toWei(`${amount}`, "ether");
  const res = await contract.methods.transferERC20(USDT_CONTRACT_ADDRESS, toAddr, `${amt}`).send({from: ADMIN_TRANSACTION_WALLET_ADDRESS});
  return res;
}

async function transferTokenSell(amount: any, privateKey: any, fromAddr: any, toAddr: any) {
  web3.accounts.wallet.add(privateKey); // ADMIN_TRANSACTION_WALLET_ADDRESS_PRIVATE_KEY);
  const gasP = await web3.getGasPrice();
  const contract = new web3.Contract(minABI, USDT_CONTRACT_ADDRESS, {gas: 3000000, gasPrice: gasP});
  // const contract = new web3.Contract(adminABI, ADMIN_CONTRACT_ADDRESS, {gas: 3000000, gasPrice: gasP});
  // const amt = web3Utils.toWei(web3Utils.toBN(amount), "ether");
  const amt = web3Utils.toWei(`${amount}`, "ether");
  const res = await contract.methods.transfer(toAddr, amt).send({from: fromAddr});
  return res;
}

// async function withdrawBNB(totalAmt: any, receiverAmount: any, adminProfit: any, toAddr: any, senderAddr: any, privateKey:any) {
//   web3.accounts.wallet.add(privateKey);
//   const gasP = await web3.getGasPrice();
//   const contract = new web3.Contract(adminABI, ADMIN_CONTRACT_ADDRESS, {gas: 5000000, gasPrice: gasP});
//   // const amt = web3Utils.toWei(web3Utils.toBN(amount), "ether");
//   const tAmt = web3Utils.toWei(`${totalAmt}`, "ether");
//   const rAmt = web3Utils.toWei(`${receiverAmount}`, "ether");
//   const aAmt = web3Utils.toWei(`${adminProfit}`, "ether");
//   const res = await contract.methods.transferBNB(tAmt, rAmt, aAmt, toAddr, ADMIN_PROFIT_WALLET_ADDRESS).send({from: senderAddr});
//   return res;
// }

// async function withdrawUSDT(totalAmt: any, receiverAmount: any, adminProfit: any, toAddr: any, senderAddr: any, privateKey:any) {
//   web3.accounts.wallet.add(privateKey); // ADMIN_TRANSACTION_WALLET_ADDRESS_PRIVATE_KEY
//   const gasP = await web3.getGasPrice();
//   const contract = new web3.Contract(adminABI, ADMIN_CONTRACT_ADDRESS, {gas: 5000000, gasPrice: gasP});
//   // const amt = web3Utils.toWei(web3Utils.toBN(amount), "ether");
//   const tAmt = web3Utils.toWei(`${totalAmt}`, "ether");
//   const rAmt = web3Utils.toWei(`${receiverAmount}`, "ether");
//   const aAmt = web3Utils.toWei(`${adminProfit}`, "ether");
//   const res = await contract.methods.transferToManyERC20(USDT_CONTRACT_ADDRESS, toAddr, ADMIN_PROFIT_WALLET_ADDRESS, tAmt, rAmt, aAmt).send({from: senderAddr}); // ADMIN_TRANSACTION_WALLET_ADDRESS
//   return res;
// }

function getEmailTemplate(header: string, message: string) {
  return `
  <div style="Margin:0;background:#f4f6f8!important;box-sizing:border-box;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:1.3;margin:0;min-width:100%;padding:0;text-align:left;width:100%!important"><span style="color:#f3f3f3;display:none!important;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden"></span>
<table class="m_-2725247185578826516body" style="Margin:0;background:#f4f6f8!important;border-collapse:collapse;border-spacing:0;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;height:100%;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;width:100%">
  <tbody><tr style="padding:0;text-align:left;vertical-align:top">
      <td align="center" valign="top" style="Margin:0;border-collapse:collapse!important;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">
          <center style="min-width:580px;width:100%">
              <table style="Margin:0 auto;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:100%">
                  <tbody>
                      <tr style="padding:0;text-align:left;vertical-align:top">
                          <td height="60px" style="Margin:0;border-collapse:collapse!important;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:60px;font-weight:400;line-height:60px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&nbsp;</td>
                      </tr>
                  </tbody>
              </table>
              <table align="center" class="m_-2725247185578826516container" style="Margin:0 auto;background:0 0;border-collapse:collapse;border-spacing:0;color:#9b9b9b;float:none;margin:0 auto;padding:0;padding-bottom:0;text-align:center;vertical-align:top;width:509px">
                  <tbody>
                      <tr style="padding:0;text-align:left;vertical-align:top">
                          <td style="Margin:0;border-collapse:collapse!important;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">
                            
                          </td>
                      </tr>
                  </tbody>
              </table>
              <table align="center" class="m_-2725247185578826516container" style="Margin:0 auto;background:#fefefe;background-color:#fff;border-collapse:collapse;border-spacing:0;border-top:6px solid #ff9b00;color:#9b9b9b;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:509px">
                  <tbody>
                      <tr style="padding:0;text-align:left;vertical-align:top">
                          <td style="Margin:0;border-collapse:collapse!important;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">
                              <table style="border-collapse:collapse;border-spacing:0;display:table;padding:0;text-align:left;vertical-align:top;width:100%">
                                  <tbody>
                                      <tr style="padding:0;text-align:left;vertical-align:top">
                                          <th class="m_-2725247185578826516small-12 m_-2725247185578826516columns" style="Margin:0 auto;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:26px;padding-right:26px;text-align:left;width:554px">
                                              <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                  <tbody><tr style="padding:0;text-align:left;vertical-align:top">
                                                      <th style="Margin:0;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                                                          <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                              <tbody>
                                                                  <tr style="padding:0;text-align:left;vertical-align:top">
                                                                      <td height="31px" style="Margin:0;border-collapse:collapse!important;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:31px;font-weight:400;line-height:31px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&nbsp;</td>
                                                                  </tr>
                                                              </tbody>
                                                          </table>
                                                          <p style="Margin:0;Margin-bottom:10px;color:#12122c;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:16px;font-weight:600!important;letter-spacing:0;line-height:normal;margin:0;margin-bottom:10px;padding:0;text-align:center">${header}
                                                          </p>
                                                          <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                              <tbody>
                                                                  <tr style="padding:0;text-align:left;vertical-align:top">
                                                                      <td height="14px" style="Margin:0;border-collapse:collapse!important;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:14px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&nbsp;</td>
                                                                  </tr>
                                                              </tbody>
                                                          </table>
                                                          <p class="m_-2725247185578826516nomText" style="Margin:0;Margin-bottom:10px;color:#4a4a4a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:500!important;letter-spacing:0;line-height:normal;margin:0;margin-bottom:10px;padding:0;text-align:center">${message}</p>
                                                       
                                                           
                                                          
                                                      </th>
                                                      <th style="Margin:0;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;width:0"></th>
                                                  </tr>
                                              </tbody></table>
                                          </th>
                                      </tr>
                                  </tbody>
                              </table>
                          </td>
                      </tr>
                  </tbody>
              </table>
   
              <table align="center" class="m_-2725247185578826516container" style="Margin:0 auto;background:#fefefe;border-collapse:collapse;border-spacing:0;color:#9b9b9b;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:509px">
                  <tbody>
                      <tr style="padding:0;text-align:left;vertical-align:top">
                          <td style="Margin:0;border-collapse:collapse!important;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">
                              <table style="border-collapse:collapse;border-spacing:0;display:table;padding:0;text-align:left;vertical-align:top;width:100%">
                                  <tbody>
                                      <tr style="padding:0;text-align:left;vertical-align:top">
                                          <th class="m_-2725247185578826516small-12 m_-2725247185578826516columns" style="Margin:0 auto;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:37px;padding-left:26px;padding-right:26px;text-align:left;width:554px">
                                              <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                  <tbody><tr style="padding:0;text-align:left;vertical-align:top">
                                                      <th style="Margin:0;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                                                         
                                                          <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                              <tbody>
                                                                  <tr style="padding:0;text-align:left;vertical-align:top">
                                                                      <td height="12.5px" style="Margin:0;border-collapse:collapse!important;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:12.5px;font-weight:400;line-height:12.5px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&nbsp;</td>
                                                                  </tr>
                                                              </tbody>
                                                          </table>
                                                          <hr style="border-top:solid 0 #dedddd;margin-left:20px;margin-right:20px">
                                                          <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                              <tbody>
                                                                  <tr style="padding:0;text-align:left;vertical-align:top">
                                                                      <td height="12.5px" style="Margin:0;border-collapse:collapse!important;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:12.5px;font-weight:400;line-height:12.5px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&nbsp;</td>
                                                                  </tr>
                                                              </tbody>
                                                          </table>
                                                           
                                                      </th>
                                                      <th style="Margin:0;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;width:0"></th>
                                                  </tr>
                                              </tbody></table>
                                          </th>
                                      </tr>
                                  </tbody>
                              </table>
                          </td>
                      </tr>
                  </tbody>
              </table>
              <table align="center" class="m_-2725247185578826516container" style="Margin:0 auto;background:0 0!important;border-collapse:collapse;border-spacing:0;color:#9b9b9b;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:509px">
                  <tbody>
                      <tr style="padding:0;text-align:left;vertical-align:top">
                          <td style="Margin:0;border-collapse:collapse!important;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">
                              <table style="border-collapse:collapse;border-spacing:0;display:table;padding:0;text-align:left;vertical-align:top;width:100%">
                                  <tbody>
                                      <tr style="padding:0;text-align:left;vertical-align:top">
                                          <th class="m_-2725247185578826516small-2 m_-2725247185578826516columns" style="Margin:0 auto;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:26px;padding-right:13px;text-align:left;width:70.67px">
                                              <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                  <tbody><tr style="padding:0;text-align:left;vertical-align:top">
                                                      <th style="Margin:0;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left"></th>
                                                  </tr>
                                              </tbody></table>
                                          </th>
                                          <th class="m_-2725247185578826516small-8 m_-2725247185578826516columns" style="Margin:0 auto;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:13px;padding-right:13px;text-align:left;width:360.67px">
                                              <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                  <tbody><tr style="padding:0;text-align:left;vertical-align:top">
                                                      <th style="Margin:0;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                                                          <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                              <tbody>
                                                                  <tr style="padding:0;text-align:left;vertical-align:top">
                                                                      <td height="12px" style="Margin:0;border-collapse:collapse!important;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:12px;font-weight:400;line-height:12px;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&nbsp;</td>
                                                                  </tr>
                                                              </tbody>
                                                          </table> </th>
                                                  </tr>
                                              </tbody></table>
                                          </th>
                                          <th class="m_-2725247185578826516small-2 m_-2725247185578826516columns" style="Margin:0 auto;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:13px;padding-right:26px;text-align:left;width:70.67px">
                                              <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                  <tbody><tr style="padding:0;text-align:left;vertical-align:top">
                                                      <th style="Margin:0;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left"></th>
                                                  </tr>
                                              </tbody></table>
                                          </th>
                                      </tr>
                                  </tbody>
                              </table>
                          </td>
                      </tr>
                  </tbody>
              </table>
              <table align="center" style="Margin:0 auto;border-collapse:collapse;border-spacing:0;float:none;margin:0 auto;padding:0;text-align:center;vertical-align:top;width:100%">
                  <tbody>
                      <tr style="padding:0;text-align:left;vertical-align:top">
                          <th class="m_-2725247185578826516small-12 m_-2725247185578826516columns" style="Margin:0 auto;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:26px;padding-right:26px;text-align:left;width:554px">
                              <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                  <tbody><tr style="padding:0;text-align:left;vertical-align:top">
                                      <th style="Margin:0;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                                          <p style="Margin:0;Margin-bottom:10px;color:rgba(74,82,106,.99);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:13px!important;font-weight:400;letter-spacing:0;line-height:normal;margin:0;margin-bottom:10px;padding:0;text-align:center">2022 TagDev Technologies Ltd</p>
                                      </th>
                                      <th style="Margin:0;color:#9b9b9b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;font-size:14px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;width:0"></th>
                                  </tr>
                              </tbody></table>
                          </th>
                      </tr>
                  </tbody>
              </table>
          </center>
      </td>
  </tr>
</tbody></table>

<div style="display:none;white-space:nowrap;font:15px courier;line-height:0">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div>
<img src="https://ci4.googleusercontent.com/proxy/cwMCrUYF6OF7OnUX-fNxoficQ1f-BOL9oyNOKGiJNUkEkVspo4Pud8Hs04iTg20ZSfXkovO6RTQ3nCIKyd1lugCkYKgz5D8DLQHFLIv1ZRL6P_A8UGjZBOHv5FDD-cCyOpq90GyDThn7-sJKgqmXBdJ8jfYW9Bxy64GNbyHwfTODj-ystQ8ObCa5GF1RSfWwf3C83TQU3TUPD_wP5gi3iXjL8rYEgKkxtbYMJXG5mcAZt4O9cIxQkRYUji-s9vlr3kKrH2p5iPlUoHaaho17m7qxG0Yr9go-D5KgTaMfAcpr1HxBl1ld4pBBeqzsqMN7_lsO9r8GAw9jIbD8haWXvHoLkIZ6wT4z9boVlkse4SbrU5GTqMEG986uR-Gafy-LFpITGTmIZVVhm6DIJDAe00zlENmXcdWnE8FFyyqKCKLxKJJdJoCld7rZkfJ8Inp5OA=s0-d-e1-ft#https://u6765830.ct.sendgrid.net/wf/open?upn=PL2pL6nzGKueW4CldqT4njE0NGk-2BFLf39nvYwxRFc8G8DAJCY-2ByBSWyI9Rve1xbAesA4-2BayL5ULhBHI1nGarJD340bI5eD7MOeyVYXIle5tuymNHtEEoTtwHQZ-2Fxj2RNCiG7VluHbo-2FDK-2FW8Jl6wBhi044mH1UQYUhpP0OlBQb1Jd9iuvsWywfwWxXAdKIAHcJs-2BA6jiJ3Fo0nHVPdIQKEcMfV7PfzZsNMjMKNeEjIscvfcPBSsQ-2FshVHC9DeMzr" alt="" width="1" height="1" border="0" style="height:1px!important;width:1px!important;border-width:0!important;margin-top:0!important;margin-bottom:0!important;margin-right:0!important;margin-left:0!important;padding-top:0!important;padding-bottom:0!important;padding-right:0!important;padding-left:0!important" class="CToWUd"></div>
  `;
}

async function sendGeneralEmail(email: string, subject: string, content: string) {
  const emailTemplate = getEmailTemplate(subject, content);

  await admin.firestore().collection("mail").add({
    to: email,
    message: {
      subject: subject,
      html: emailTemplate,
    },
  });
}

const minABI:AbiItem[] = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address",
      },
      {
        "name": "_value",
        "type": "uint256",
      },
    ],
    "name": "transfer",
    "outputs": [
      {
        "name": "",
        "type": "bool",
      },
    ],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256",
      },
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool",
      },
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address",
      },
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
  },
];

const adminABI:AbiItem[] = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "totalAmount",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "receiverAmount",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "adminProfit",
        "type": "uint256",
      },
      {
        "internalType": "address payable",
        "name": "destAddr",
        "type": "address",
      },
      {
        "internalType": "address payable",
        "name": "adminAddr",
        "type": "address",
      },
    ],
    "name": "transferBNB",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "token",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256",
      },
    ],
    "name": "transferERC20",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "token",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "from",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256",
      },
    ],
    "name": "transferFromERC20",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [
      {
        "internalType": "contract IERC20",
        "name": "token",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "toAddr",
        "type": "address",
      },
      {
        "internalType": "address",
        "name": "adminAddr",
        "type": "address",
      },
      {
        "internalType": "uint256",
        "name": "totalAmount",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "receiverAmount",
        "type": "uint256",
      },
      {
        "internalType": "uint256",
        "name": "adminProfit",
        "type": "uint256",
      },
    ],
    "name": "transferToManyERC20",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function",
  },
];
