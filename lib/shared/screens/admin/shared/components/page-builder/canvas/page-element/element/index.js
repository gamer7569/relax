import Component from 'components/component';
import isElementSelected from 'helpers/is-element-selected';
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {outElement, overElement, selectElement} from 'actions/page-builder';

import Element from './element';

@connect(
  (state, props) => {
    const {element, context, settings, selectable, editable} = props;
    const {pageBuilder} = state;
    const editing = pageBuilder.editing;
    const dragging = editing && state.dnd.dragging;

    const elem = {
      id: element.id,
      context
    };

    const selected = selectable && isElementSelected(pageBuilder.selected, elem);
    const overed = selectable && isElementSelected(pageBuilder.overed, elem);
    const focused = isElementSelected(pageBuilder.focused, elem);

    const linkingDataMode = pageBuilder.menuTab === 'link';
    const isHighlightable = !!(
      selectable && !dragging && (
        (props.elementLinks && props.elementLinks.length) ||
        (focused || selected || overed)
      )
    );
    const isDraggable =
      editable &&
      settings.drag &&
      !(selected && settings.drag.dragSelected === false)
    ;

    return {
      overed,
      selected,
      display: state.display,
      dragging,
      isHighlightable,
      isDraggable,
      focused,
      editing,
      linkingDataMode
    };
  },
  (dispatch) => bindActionCreators({
    selectElement,
    overElement,
    outElement
  }, dispatch)
)
export default class ElementContainer extends Component {
  static propTypes = {
    children: PropTypes.node,
    element: PropTypes.object.isRequired,
    overed: PropTypes.bool,
    selected: PropTypes.bool,
    disableSelection: PropTypes.bool,
    linkingDataMode: PropTypes.bool,
    elementLinks: PropTypes.array
  };

  render () {
    const {element} = this.props;

    return (
      <Element
        {...this.props}
        hasAnimation={element.animation && element.animation.use}
      >
        {this.props.children}
      </Element>
    );
  }
}