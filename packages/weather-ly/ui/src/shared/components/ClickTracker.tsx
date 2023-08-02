import React, { ReactNode } from 'react';
import ReactDOM from "react-dom";

interface Props {
  children: ReactNode;
  moduleName: string;
}

type ClickData = {
  module: string,
  element: EventTarget | null,
  elementId: string,
  elementClass: string,
  timeStamp: number
}

class ClickTracker extends React.Component<Props> {
  private _isTracking: boolean;
  constructor(props: Props) {
    super(props);

    this._isTracking = process.env.CLICK_TRACKER_ON === undefined ? true : !!process.env.CLICK_TRACKER_ON;
  }

  static sessionData: ClickData[] = [];

  handleEvent = (e: Event) => {
    if (!this._isTracking) {
      return;
    }
    const element = e.currentTarget;

    const clickData: ClickData = {
      module: this.props.moduleName,
      element,
      elementId: element?.id,
      elementClass: element?.className,
      timeStamp: Date.now()
    };

    ClickTracker.sessionData.push(clickData);
    if (process.env.NODE_ENV !== 'production') {
      console.log('%cCLickTracker fired!', 'color: yellow');
      console.log('clickData:', clickData);
      console.log('Session Data:', ClickTracker.sessionData);
    }
  };

  handleChildMounted = (element: any, child: any) => {
    const DOMNode = ReactDOM.findDOMNode(element);
    if (DOMNode) {
      if (!this._isTracking) {
        return;
      }
      // NOTE: This is where a tracker can be customized to respond to different events
      // TODO: Generalize this out to do onChange events, such as when a user actually chooses an option from a combo box?
      DOMNode.addEventListener("click", this.handleEvent);
    }
    if (typeof child.ref === "function") {
      child.ref(element);
    }
  };

  wrapWithClass = (functionalComponent: any) => (
    class extends React.Component {
      render() {
        return functionalComponent;
      }
    }
  );

  remapChildren(children: any) {
    return React.Children.map(children, (child: any): any => {
      // forwarding ref: https://reactjs.org/docs/forwarding-refs.html
      const ref = (element: any) => this.handleChildMounted(element, child);

      if (typeof child.type === "string") {
        // Is DOM element, e.g. <button />
        // Cloning element replaces it with a new one with a shallowly appended/replaced set of properties
        // https://reactjs.org/docs/react-api.html#cloneelement
        return React.cloneElement(child, { ref });
      } else if (React.Children.count(child.props.children)) {
        // React component w/ props children, e.g.
        // <Component ... />
        //   <Child ... />
        //   <.../>
        // </Component>
        return React.cloneElement(child, {
          children: this.remapChildren(child.props.children)
        });
      } else if (child.type.prototype.render) {
        // Is React class component w/o props children, e.g. <ClassComponent ... />
        // Checking for prototype render method is the way to differentiate a React class from functional component
        return React.cloneElement(child, { ref });
      } else {
        // Is React functional component w/o props children, e.g. <FunctionComponent ... />
        // Similar to cloneElement,
        // except in this case we are needing to create a React class component from a React functional component
        // https://reactjs.org/docs/react-api.html#createelement
        // It first needs to be wrapped in a class, but this class does not yet exist in the DOM so cannot be cloned
        // This is why createElement is used
        return React.createElement(this.wrapWithClass(child), { ref });
      }
    });
  }

  render() {
    return this.remapChildren(this.props.children);
  }
}

export default ClickTracker;