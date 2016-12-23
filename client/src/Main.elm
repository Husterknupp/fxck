module Main exposing (main)

import Board exposing (Board)
import Token
import Debug
import Html exposing (..)
import WebSocket
import Ws

type Msg
  = NoOp
  | WsMsg String

type alias Model =
  { board : Board
  , notification : Maybe String
  }

initialModel : Model
initialModel =
  { board = Board.emptyBoard
  , notification = Nothing
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
    WsMsg msg ->
      ( (Ws.update msg model)
      , Cmd.none
      )

view : Model -> Html Msg
view model =
  div
    []
    ( List.append
      ( Board.view model.board )
      [ text (toString model) ]
    )

subscriptions : Model -> Sub Msg
subscriptions model =
  ( WebSocket.listen "ws://192.168.178.22:5000/ws" WsMsg )

main =
  Html.program
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }
