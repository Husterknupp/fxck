module Main exposing (main)

import Board exposing (Board)
import Token
import Debug
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import WebSocket
import Ws
import Msg exposing (..)

type alias Model =
  { board : Board
  , notification : Maybe String
  , player : String
  }

initialModel : Model
initialModel =
  { board = Board.emptyBoard
  , notification = Nothing
  , player = "🍭"
  }

init : ( Model, Cmd Msg )
init =
  ( initialModel
  , Cmd.none
  )

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    NoOp -> (model, Cmd.none)
    WsReceive msg ->
      ( (Ws.update msg model)
      , Cmd.none
      )
    WsSend msg ->
      ( { model | notification = Nothing }
      , WebSocket.send "ws://localhost:5000/ws" msg
      )
    SetPlayer newPlayer ->
      ( { model | player = newPlayer }
      , Cmd.none
      )

view : Model -> Html Msg
view model =
  div
    []
    ( List.append
      ( Board.view model.board model.player )
      [ p []
        [ text "Player: "
        , input
          [ onInput SetPlayer
          , placeholder "🍭"
          ]
          []
        ]
      , p []
        [ button
          [ onClick (WsSend "{ \"type\" : \"reset\"}") ]
          [ text "Reset" ]
        ]
      , p []
        [text (toString model.notification)]
      ]
    )

subscriptions : Model -> Sub Msg
subscriptions model =
  ( WebSocket.listen "ws://localhost:5000/ws" WsReceive )

main =
  Html.program
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }
