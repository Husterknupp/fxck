module Move exposing (..)

import Token exposing (Token)
import Json.Encode as Encode

type alias Move =
  { position : Int
  , token : Token
  }

encode m =
  Encode.object
    [ ( "type", Encode.string "move" )
    , ( "message"
      , Encode.object
        [ ( "position", Encode.int m.position )
        , ( "player", Token.encode m.token )
        ]
      )
    ]
