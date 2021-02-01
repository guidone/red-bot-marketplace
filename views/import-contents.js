import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Notification, Alert } from 'rsuite';
import { useApolloClient } from 'react-apollo';
import gql from 'graphql-tag';
import useFetch from 'use-http';
import _ from 'lodash';

import useSettings from '../../../src/hooks/settings';
import withConfiguration from '../../../src/helpers/with-configuration';
import serial from '../../../src/helpers/serial';

import decodeBase64 from '../helpers/decode-base-64';
import cleanupRows from '../helpers/cleanup-rows';


const DELETE_ALL_CONTENTS = gql`
mutation($namespace: String) {
  deleteContents(namespace: $namespace)
}
`;
const CREATE_CONTENT = gql`
mutation($content: InputContent!) {
  createContent(content: $content) {
    id
  }
}
`;

const ImportContent = ({
  gitlab_token,
  namespace,
  refetch,
  fileName,
  label
}) => {
  const client = useApolloClient();
  const [state, setState] = useState(null);
  const { gitlabProjectIdPluginsList } = useSettings();

  const { get, response } = useFetch(
    `https://git.clxnetworks.net/api/v4/projects/${gitlabProjectIdPluginsList}/repository/files/${fileName}?ref=master`,
    {
      headers: { 'PRIVATE-TOKEN': gitlab_token }
    }
  );
  const hasSecretKey = !_.isEmpty(gitlab_token);

  return (
    <Button
      disabled={state != null || !hasSecretKey}
      appearance="primary"
      onClick={async () => {
        setState('Importing...');
        const rawPlugins = await get();
        if (response.ok) {
          let plugins = rawPlugins != null && rawPlugins.content != null ? JSON.parse(decodeBase64(rawPlugins.content)) : [];
          // delete all contents
          await client.mutate({ mutation: DELETE_ALL_CONTENTS, variables: { namespace } });
          // remove all unwanted strings like id, __typename
          plugins = cleanupRows(plugins);
          // store all content
          await serial(plugins, async plugin => await client.mutate({
            mutation: CREATE_CONTENT,
            variables: { content: { ...plugin, namespace } }
          }));
          setState(null);
          // reload table
          refetch();
          Alert.success(`Elements imported successfully`);
        } else {
          Alert.error(`Error downloading ${fileName} from GitLab`);
          setState(null);
        }
      }}
    >
      {state != null ? state : label}
    </Button>
  );
};
ImportContent.propTypes = {
  gitlab_token: PropTypes.string,
  namespace: PropTypes.string,
  refetch: PropTypes.func,
  fileName: PropTypes.string
};

export default withConfiguration(ImportContent, 'plugin-installer');