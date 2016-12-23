module TokenView exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Decode exposing (field)
import Json.Encode as Encode
import Msg exposing (..)
import Move exposing (..)
import Token exposing (..)

sendMove token position =
  token
  |> Move position
  |> Move.encode
  |> Encode.encode 0
  |> WsSend

view token position player =
  let (tileText, event) =
    case token of
      Just (Just actualToken) -> (actualToken, [])
      _ -> ("", [onClick (sendMove player position)])
  in
    [ a
      ( List.append
        [ style
          [ ( "width", "100px" )
          , ( "height", "100px" )
          , ( "display", "inline-block" )
          , ( "background-color", "#eee" )
          , ( "margin", "10px" )
          , ( "font-size", "64px" )
          ]
        , class "text-center"
        , attribute "role" "button"
        ]
        event
      )
      [ text tileText ]
  ]
