import _ from 'lodash';

const cleanupRows = (rows, omitKeys = ['id', '__typename']) => {
  if (_.isArray(rows)) {
    return rows.map(row => cleanupRows(row));
  } else if (_.isObject(rows)) {
    const keys = Object.keys(rows).filter(key => !omitKeys.includes(key));
    return keys.reduce((acc, key) => ({ ...acc, [key]: cleanupRows(rows[key]) }),{});
  } else {
    return rows;
  }
};

export default cleanupRows;