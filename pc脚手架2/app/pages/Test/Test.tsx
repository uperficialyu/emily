import { allowStateChangesStart } from 'mobx/lib/internal';
import React, { Component } from 'react'

export default class Test extends Component {

  render() {
    let a: number = 2;
    a = 3;
    a= '3';
    return (
      <div>
        qqq
      </div>
    )
  }
}
