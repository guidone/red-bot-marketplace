import React, { Fragment } from 'react';
import { plug } from 'code-plug';

import { Content } from '../../src/components';

import PublishContents from './views/publish-contents';
import ImportContents from './views/import-contents';
import DefaultConfiguration from './views/default-configuration';

const PLUGINS_FILE_NAME = 'plugins2.json';
const TEMPLATES_FILE_NAME = 'templates.json';

plug('sidebar', null, {
  id: 'mission-control',
  label: 'Mission Control',
  permission: 'admins',
  icon: 'rocket',
  options: [
    {
      id: 'plugins-manager',
      label: 'Plugins palette',
      permission: 'configuration.plugins',
      url: '/plugins-manager'
    }
  ]
});

plug('pages', Content.Contents, {
  url: '/plugins-manager',
  title: 'Plugins Manager',
  id: 'plugins-manager',
  namespace: 'plugins',
  breadcrumbs: ['Mission Control', 'Plugins palette'],
  permission: 'configuration.plugins',
  labels: {
    saveContent: 'Save plugin',
    createContent: 'Create plugin',
    emptyContent: 'No plugins',
  },
  custom: props => (
    <Fragment>
      <ImportContents
        {...props}
        namespace="plugins"
        fileName={PLUGINS_FILE_NAME}
        label="Import plugins"
      />
      <PublishContents
        {...props}
        namespace="plugins"
        fileName={PLUGINS_FILE_NAME}
        label="Publish plugins"
      />
    </Fragment>
  ),
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

plug('sidebar', null, {
  id: 'mission-control',
  label: 'Mission Control',
  permission: 'admins',
  icon: 'rocket',
  options: [
    {
      id: 'plugins-manager',
      label: 'Templates palette',
      permission: 'configuration.plugins',
      url: '/flows-templates-manager'
    }
  ]
});

plug('pages', Content.Contents, {
  url: '/flows-templates-manager',
  title: 'Flows Templates',
  id: 'flows-templates',
  namespace: 'templates',
  permission: 'configuration.plugins',
  breadcrumbs: ['Mission Control', 'Flows Templates'],
  labels: {
    saveContent: 'Save template',
    createContent: 'Create template',
    emptyContent: 'No templates',
  },
  custom: props => (
    <Fragment>
      <ImportContents
        {...props}
        namespace="templates"
        fileName={TEMPLATES_FILE_NAME}
        label="Import templates"
      />
      <PublishContents
        {...props}
        namespace="templates"
        fileName={TEMPLATES_FILE_NAME}
        label="Publish templates"
      />
    </Fragment>
  ),
  customFieldsSchema: [
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
    permission: 'configuration.plugins',
    name: 'Plugins & Templates Manager',
    description: 'Add and edit plugins / templates',
    group: 'General'
  }
);