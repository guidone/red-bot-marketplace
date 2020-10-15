import React from 'react';
import { plug } from 'code-plug';

import { withConfigurationPage, Content } from '../../src/components';

import PublishPlugins from './views/publish-plugins';
import ConfigureMarketPlace from './views/configure-market-place';
import DefaultConfiguration from './views/default-configuration';

const Legend = () => (
  <div>
    Configure the id and the key to access <strong>jsonbing.io</strong> for the plugins met information.
    <br />
    Docs about the API <a href="https://jsonbin.io/api-reference/bins/read" target="blank">here</a>.
  </div>
);

plug('sidebar', null, {
  id: 'mission-control',
  label: 'Mission Control',
  permission: 'admins',
  icon: 'rocket',
  options: [
    {
      id: 'plugins-manager',
      label: 'Plugins palette',
      permission: 'plugins.manager',
      url: '/plugins-manager'
    }
  ]
});

plug('sidebar', null, {
  id: 'configuration',
  order: 9999,
  label: 'Configuration',
  permission: 'plugins.manager',
  icon: 'cog',
  options: [
    {
      id: 'configuration-plugins-manager',
      label: 'Plugins Manager',
      url: '/configuration-plugins-lists-manager',
    }
  ]
});

plug(
  'pages',
  withConfigurationPage(
    'plugins-manager',
    ConfigureMarketPlace,
    { Legend, title: 'Plugins Manager' }
  ),
  {
    permission: 'plugins.manager',
    url: '/configuration-plugins-lists-manager',
    title: 'Plugins Manager',
    id: 'configuration'
  }
);


plug('pages', Content.Contents, {
  url: '/plugins-manager',
  title: 'Plugins Manager',
  id: 'plugins-manager',
  namespace: 'plugins',
  breadcrumbs: ['Plugins Manager', 'Plugins'],
  labels: {
    saveContent: 'Save plugin',
    createContent: 'Create plugin',
    emptyContent: 'No plugins',
  },
  custom: () => <PublishPlugins />,
  customFieldsSchema: [
    {
      key: 'flow',
      type: 'boolean',
      description: `URL of the Node-RED flow for this plugin`,
      color: 'cyan'
    },
    {
      key: 'id',
      type: 'string',
      description: `Unique id of the plugin`,
      color: 'red'
    },
    {
      key: 'version',
      type: 'string',
      description: `The version of the current (latest) plugin`,
      color: 'red'
    },
    {
      key: 'projectId',
      type: 'string',
      description: `The project ID of the plugin repo in GitLab`,
      color: 'red'
    },
    {
      key: 'tags',
      type: 'tags',
      description: `List of keywords, comma separated`,
      color: 'red'
    },
    {
      key: 'content_title',
      type: 'string',
      description: `Create a content with this title`,
      color: 'violet'
    },
    {
      key: 'content_slug',
      type: 'string',
      description: `Create a content with this slug`,
      color: 'violet'
    },
    {
      key: 'content_body',
      type: 'string',
      description: `Create a content with this body`,
      color: 'violet'
    },
    {
      key: 'content_namespace',
      type: 'string',
      description: `Create a content with this namespace`,
      color: 'violet'
    }
  ]
});

plug('content-tabs', DefaultConfiguration, {
  id: 'content-configuration',
  label: 'Configuration',
  namespace: ['plugins']
});

plug(
  'permissions',
  null,
  {
    permission: 'plugins.manager',
    name: 'Plugins Manager',
    description: 'Add and edit plugins',
    group: 'General'
  }
);