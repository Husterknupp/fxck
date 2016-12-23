module Board exposing (..)

import Maybe exposing (..)
import Array exposing (..)
import Token exposing (..)
import Html exposing (..)
import Json.Decode as Decode exposing (field)

type alias Board = Array (Maybe Token)

emptyBoard : Board
emptyBoard = Array.repeat 9 Nothing

decoder =
  Decode.array Token.decoder

view board =
  [ table []
    [ tr []
      [ td []
        ( Token.view (Array.get 0 board) )
      , td []
        ( Token.view (Array.get 1 board) )
      , td []
        ( Token.view (Array.get 2 board) )
      ]
    , tr []
      [ td []
        ( Token.view (Array.get 3 board) )
      , td []
        ( Token.view (Array.get 4 board) )
      , td []
        ( Token.view (Array.get 5 board) )
      ]
    , tr []
      [ td []
        ( Token.view (Array.get 6 board) )
      , td []
        ( Token.view (Array.get 7 board) )
      , td []
        ( Token.view (Array.get 8 board) )
      ]
    ]
  ]
