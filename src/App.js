import React, { useEffect, useState } from 'react';
import Amplify, { Auth, Hub, graphqlOperation, API } from 'aws-amplify';
import awsconfig from './aws-exports';
import { getIpaddress, listCloudFormationExports } from './graphql/queries';

Amplify.configure(awsconfig);

function App() {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [ipaddress, setIpaddress] = useState(null);
  const [cfnExports, setCfnExports] = useState([]);

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
  
  async function doGetIpaddress() {
    try {
      const data = await API.graphql(graphqlOperation(getIpaddress));
      setIpaddress(data.data.getIpaddress.ipaddress);
    } catch (err) { console.log('error fetching ipaddress') }
  }
  
  async function doListCfnExports() {
    try {
      const data = await API.graphql(graphqlOperation(listCloudFormationExports));
      setCfnExports(data.data.listCloudFormationExports);
    } catch (err) { console.log('error fetching CloudFormation exports') }
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
      
      <section className="section">
        <div className="block">
          IP Address: <strong>{ipaddress ? ipaddress : 'None'}</strong>
        </div>
        <button 
          className="button"
          onClick={doGetIpaddress}
          >Get IP address
        </button>
      </section>
      
      <section className="section">
        <p className="title">
          Listing of CloudFormation Exports
        </p>
        <div class="block">
          <button 
            className="button"
            onClick={doListCfnExports}
            >List CloudFormation Exports
          </button>
        </div>
        <div class="block">
          <table className="table is-fullwidth is-hoverable">
            <thead>
              <tr>
                <th>Stack</th>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {
                cfnExports.map((cfnExport, index) => (
                  <tr key={cfnExport.id}>
                    <td>{cfnExport.id}</td>
                    <td>{cfnExport.sku}</td>
                    <td>{cfnExport.name}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default App;