module Board exposing (..)

import Maybe exposing (..)
import Array exposing (..)
import Token exposing (..)
import TokenView exposing (..)
import Html exposing (..)
import Json.Decode as Decode exposing (field)
import DecodeUtils

type alias Board = Array (Maybe Token)

emptyBoard : Board
emptyBoard = Array.repeat 9 Nothing

decoder =
  Decode.array (DecodeUtils.maybe Token.decoder)

view board player =
  [ table []
    [ tr []
      [ td []
        ( TokenView.view (Array.get 0 board) 0 player )
      , td []
        ( TokenView.view (Array.get 1 board) 1 player )
      , td []
        ( TokenView.view (Array.get 2 board) 2 player )
      ]
    , tr []
      [ td []
        ( TokenView.view (Array.get 3 board) 3 player )
      , td []
        ( TokenView.view (Array.get 4 board) 4 player )
      , td []
        ( TokenView.view (Array.get 5 board) 5 player )
      ]
    , tr []
      [ td []
        ( TokenView.view (Array.get 6 board) 6 player )
      , td []
        ( TokenView.view (Array.get 7 board) 7 player )
      , td []
        ( TokenView.view (Array.get 8 board) 8 player )
      ]
    ]
  ]
