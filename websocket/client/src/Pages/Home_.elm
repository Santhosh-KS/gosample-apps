module Pages.Home_ exposing (Model, Msg, page)

import Effect exposing (Effect)
import File exposing (File)
import Html exposing (Html)
import Html.Attributes as Attr
import Html.Events
import Json.Decode as D
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
    { files : List File }


init : () -> ( Model, Effect Msg )
init () =
    ( {files = []}
    , Effect.none
    )



-- UPDATE


type Msg
    = GotFiles (List File)


update : Msg -> Model -> ( Model, Effect Msg )
update msg model =
    case msg of
     GotFiles files ->
            ( {model | files = files}, Effect.none )




-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> View Msg
view model =
    { title = "Pages.Home_"
    , body = [ Html.text "/home_" ]
    }


dropzoneView : Html Msg
dropzoneView =
    Html.div
        [ Attr.id "dropzone-id"
        ]
        [ Html.node "dropzone-demo" [] []
        ]


testview : Model -> Html Msg
testview model =
    Html.div [ Attr.id "dropzone-id" ]
        [ Html.input
            [ Attr.type_ "file"
            , Attr.multiple True
            , Html.Events.on "change" (D.map GotFiles filesDecoder)
            ]
            []
        , Html.div [] [ Html.text (Debug.toString model) ]
        ]


filesDecoder : D.Decoder (List File)
filesDecoder =
    D.at [ "target", "files" ] (D.list File.decoder)
