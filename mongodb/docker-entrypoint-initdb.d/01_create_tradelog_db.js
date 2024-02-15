db = db.getSiblingDB('tradelog');
db.createUser({
  user: 'tradelog_user',
  pwd: 'tradelog_password',
  roles: [{ role: 'readWrite', db: 'tradelog' }]
});
