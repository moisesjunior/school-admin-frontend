import Amplify from 'aws-amplify';

// eslint-disable-next-line import/no-anonymous-default-export
export default () => Amplify.configure({
    Auth: {
      region: process.env.REACT_APP_AWS_REGION,
      identityPoolRegion: process.env.REACT_APP_AWS_REGION,
      userPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL,
      userPoolWebClientId: process.env.REACT_APP_AWS_COGNITO_WEB_CLIENT_ID,
      mandatorySignIn: false,
      authenticationFlowType: "USER_PASSWORD_AUTH"
    }
  });