import {__} from "@wordpress/i18n";
import {registerPlugin} from "@wordpress/plugins";
import {PluginSidebar, PluginSidebarMoreMenuItem} from "@wordpress/edit-post";
import {PanelBody, TextControl, ColorPicker, DateTimePicker} from "@wordpress/components";
import {withSelect, withDispatch} from "@wordpress/data";
import {__experimentalGetSettings} from '@wordpress/date';
import {withState} from '@wordpress/compose';

registerPlugin('myprefix-sidebar', {
    icon: 'smiley',
    render: () => {
        return (
            <>
                <PluginSidebarMoreMenuItem
                    target="myprefix-sidebar"
                >
                    {__('Meta Options', 'textdomain')}
                </PluginSidebarMoreMenuItem>
                <PluginSidebar
                    name="myprefix-sidebar"
                    title={__('Meta Options', 'textdomain')}
                >
                    <PluginMetaFields/>
                </PluginSidebar>
            </>
        )
    }
});

let PluginMetaFields = (props) => {
    return (
        <>
            <PanelBody
                title={__("Meta Fields Panel", "textdomain")}
                icon="admin-post"
                intialOpen={true}
            >
                <TextControl
                    value={props.text_metafield}
                    label={__("Text Meta", "textdomain")}
                    onChange={(value) => props.onMetaFieldChange(value)}
                />
                <ColorPicker
                    color={props.text_metafield}
                    label={__("Colour Meta", "textdomain")}
                    onChangeComplete={(color) => props.onMetaFieldChange(color.hex)}
                />
                <MyDateTimePicker/>
            </PanelBody>
        </>
    )
};

const MyDateTimePicker = withState({
    date: new Date(),
})(({date, setState}) => {
    const settings = __experimentalGetSettings();

    // To know if the current timezone is a 12 hour time with look for an "a" in the time format.
    // We also make sure this a is not escaped by a "/".
    const is12HourTime = /a(?!\\)/i.test(
        settings.formats.time
            .toLowerCase() // Test only the lower case a
            .replace(/\\\\/g, '') // Replace "//" with empty strings
            .split('').reverse().join('') // Reverse the string and test for "a" not followed by a slash
    );

    return (
        <DateTimePicker
            currentDate={date}
            onChange={(date) => setState({date})}
            is12Hour={is12HourTime}
        />
    );
});

PluginMetaFields = withSelect(
    (select) => {
        return {
            text_metafield: select('core/editor').getEditedPostAttribute('meta')['_myprefix_text_metafield']
        }
    }
)(PluginMetaFields);

PluginMetaFields = withDispatch(
    (dispatch) => {
        return {
            onMetaFieldChange: (value) => {
                dispatch('core/editor').editPost({meta: {_myprefix_text_metafield: value}})
            }
        }
    }
)(PluginMetaFields);