import React, { useEffect, useState } from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

function App() {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
          getUser().then(userData => setUser(userData));
          console.log('signIn', data);
          break;
        case 'signOut':
          console.log('signOut', data);
          setUser(null);
          break;
        case 'signIn_failure':
          getUser().then(userData => setUser(userData));
          console.log('signIn_failure', data);
          break;
        default:
          console.log('default');
      }
    });
    
    getUser().then(userData => setUser(userData));
  }, []);
  
  useEffect(() => {
    Auth.currentUserInfo().then((userInfoData) => {
      setUserInfo(userInfoData);
      console.log(user);
    });
  }, [user]);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
  }
  
  return (
    <div>
      <div className="hero-body">
        <p className="title">
          Authenticaton Example Page
        </p>
        <p className="subtitle">
          Authorization with Google for AWS Cognito UserPool.
        </p>
      </div>
      
      <section className="section">
        <div className="block">
          User: <strong>{userInfo ? userInfo.attributes.email : 'None'}</strong>
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button 
              className="button is-link"
              onClick={() => Auth.federatedSignIn()}
              >Sign In
            </button>
          </div>
          <div className="control">
            <button 
              className="button is-link"
              onClick={() => Auth.signOut()}
              >Sign Out
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App;