module Msg exposing (..)

type Msg
  = NoOp
  | WsReceive String
  | WsSend String
  | SetPlayer String
