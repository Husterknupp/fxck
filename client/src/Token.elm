module Token exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Json.Decode as Decode exposing (field)

type Token
  = X
  | O

decoder =
  Decode.andThen
    (\tokenString -> Decode.succeed (stringToMaybeToken tokenString))
    Decode.string

stringToMaybeToken s =
  case s of
    "X" -> Just X
    "O" -> Just O
    _ -> Nothing

view token =
  let tileText =
    case token of
      Nothing -> ""
      Just Nothing -> ""
      Just (Just X) -> "X"
      Just (Just O) -> "O"
  in
    [ a
      [ style
        [ ( "width", "100px" )
        , ( "height", "100px" )
        , ( "display", "inline-block" )
        , ( "background-color", "#eee" )
        , ( "margin", "10px" )
        ]
      ]
      [ text tileText ]
  ]
