import * as React from 'react';
import * as firebase from 'firebase';
import { Message, Icon } from 'semantic-ui-react';

interface Props {
}

interface State {
  connected: boolean;
  hasConnectedBefore: boolean;
  fref: firebase.database.Reference;
}

export class ConnectionStatus extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasConnectedBefore: false,
      connected: false,
      fref: firebase.database().ref('.info/connected')
    };
  }

  firebaseCallback = (status: firebase.database.DataSnapshot | null) => {

    if (status) {
      this.setState((prevState: State, props: Props) => { 

        return {
          connected: status.val(),
          hasConnectedBefore: status.val() ? true : prevState.hasConnectedBefore
        };
      });
    }
  }

  componentDidMount() {
    this.state.fref.on('value', this.firebaseCallback);
  }

  componentWillUnmount() {
    this.state.fref.off('value', this.firebaseCallback);
  }

  render() {
    const { connected, hasConnectedBefore } = this.state;

    return !connected && hasConnectedBefore ? (
      <Message icon negative>
        <Icon name="circle notched" loading />
        <Message.Content>
          <Message.Header>Connection Lost</Message.Header>
          Refresh the page, as local changes will no longer be committed to the server.
        </Message.Content>
      </Message>
    ) : <div />;
  }
}