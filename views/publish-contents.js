import React, { useState } from 'react';
import { Button, Notification } from 'rsuite';
import { useApolloClient } from 'react-apollo';
import gql from 'graphql-tag';
import useFetch from 'use-http';
import _ from 'lodash';

import useSettings from '../../../src/hooks/settings';
import withConfiguration from '../../../src/helpers/with-configuration';

const CONTENT_PLUGINS = gql`
query($namespace: String) {
  contents(namespace: $namespace) {
    id,
    title,
    body,
    payload,
    slug,
    categoryId,
    language,
    fields {
      name,
      value
    }
  }
}
`;

const PublishContent = ({ gitlab_token, fileName, label, namespace }) => {
  const client = useApolloClient();
  const [state, setState] = useState(null);
  const { gitlabProjectIdPluginsList } = useSettings();
  const { post, response: postResponse } = useFetch(`https://git.clxnetworks.net/api/v4/projects/${gitlabProjectIdPluginsList}/repository/commits`, {
    headers: { 'PRIVATE-TOKEN': gitlab_token }
  });
  const hasSecretKey = !_.isEmpty(gitlab_token);

  return (
    <Button
      disabled={state != null || !hasSecretKey}
      appearance="primary"
      onClick={async () => {
        setState('Loading...');
        const response = await client.query({
          query: CONTENT_PLUGINS,
          fetchPolicy:
          'network-only',
          variables: { namespace }
        });
        const plugins = response.data.contents;
        setState('Publishing...');
        const res = await post({
          branch: 'master',
          commit_message: `Update list: ` + new Date().toDateString(),
          actions: [
            {
              action: 'update',
              file_path: fileName,
              content: JSON.stringify(plugins, null, 2)
            }
          ]
        });

        if (postResponse.status !== 201) {
          Notification.error({
            title: 'Something went wrong',
            description: 'Content was not published, GitLab token is not valid'
          });
          console.error(res);
        } else {
          Notification.success({ title: 'Published', description: 'Content published succesfully '});
        }
        setState(null);
      }}
    >
      {state != null ? state : label}
    </Button>
  );
};

export default withConfiguration(PublishContent, 'plugin-installer');