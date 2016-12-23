module Token exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Json.Decode as Decode exposing (field)
import Json.Encode as Encode
import Msg exposing (..)

type alias Token = String

decoder = Decode.string

encode t = Encode.string t
