module Ws exposing (..)

import Array
import Token exposing (..)
import Board exposing (..)
import Http exposing (..)
import Json.Decode as Decode exposing (field)

type WsMsgType
  = BoardMsgType
  | FinishMsgType
  | UnknownMsgType

update msg model =
  let msgType =
    Decode.decodeString typeDecoder msg
  in
    case msgType of
      Ok BoardMsgType ->
        let newBoardResult =
          Decode.decodeString (field "message" Board.decoder) msg
        in
          case newBoardResult of
            Ok newBoard ->
              { model | board = newBoard }
            Err error ->
              { model | notification = Just error }
      Ok FinishMsgType ->
        let finishedPlayer =
          Decode.decodeString (field "message" Decode.string) msg
        in
          case finishedPlayer of
            Ok player ->
              { model | notification = Just (String.concat [player, " won!"]) }
            Err error ->
              { model | notification = Just error }
      Err error ->
        { model | notification = Just error }
      Ok UnknownMsgType ->
        { model | notification = Just "Unknown message received" }

typeDecoder =
  field "type" typeDecoderDecoder

typeDecoderDecoder =
  Decode.andThen
    (\typeString -> Decode.succeed (stringToType typeString))
    Decode.string

stringToType s =
  case s of
    "board" -> BoardMsgType
    "finish" -> FinishMsgType
    _ -> UnknownMsgType
