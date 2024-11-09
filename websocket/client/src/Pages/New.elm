module Pages.New exposing (Model, Msg, page)

import Effect exposing (Effect)
import Html exposing (Html)
import Html.Attributes as Attr
import Page exposing (Page)
import Route exposing (Route)
import Shared
import View exposing (View)


page : Shared.Model -> Route () -> Page Model Msg
page shared route =
    Page.new
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }



-- INIT


type alias Model =
    {}


init : () -> ( Model, Effect Msg )
init () =
    ( {}
    , Effect.none
    )



-- UPDATE


type Msg
    = NoOp


update : Msg -> Model -> ( Model, Effect Msg )
update msg model =
    case msg of
        NoOp ->
            ( model
            , Effect.none
            )



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> View Msg
view model =
    { title = "Pages.New"
    , body =
        [ dropzoneView
        ]
    }


dropzoneView : Html Msg
dropzoneView =
    Html.div
        []
        [ -- Html.small [] [ Html.text "Dummy upload" ],
          Html.h1 [] [ Html.text "Dropzone File upload" ]
        , Html.form
            [ Attr.class "dropzone"
            , Attr.id "my-form"
            , Attr.action "/"
            ]
            [ Html.node "dropzone-demo" [] []
            , Html.pre [ Attr.id "output" ] []
            ]
        ]



{- <form class="dropzone" id="my-form" action="/"></form>

   <h1>Debug output:</h1>
   <pre id="output"></pre>
-}
