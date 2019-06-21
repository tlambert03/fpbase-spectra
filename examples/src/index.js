
import React from 'react';
import { render} from 'react-dom';
import App from '../../src';


if (process.env.NODE_ENV !== "production") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render")
  whyDidYouRender(React, { include: [] })
}


render(<App uri={"http://localhost:8000/graphql/"}/>, document.getElementById("root"));
