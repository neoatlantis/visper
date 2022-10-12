Visper
======

Visper is an encrypted chatroom. Messaging done with Socket.IO, and encryption
using TweetNaCl. This repo contains both the server and client. 

To start, the user needs to join a random chatroom. Room ID is picked randomly,
the user will invite other members using this random room ID.

A random channel password may be set later after joining the room. If this is
done, room members may communicate with each other only when they have the
same password entered.

Built on this layer of shared secret encryption, each user is identified with a
public key from TweetNaCl. This identification is broadcasted to all room
members periodically. Ultimately, all messages between users will be encrypted
using these public keys, establishing peer-to-peer encryption.
