db = db.getSiblingDB('tradelog_test');
db.createUser({
  user: 'tradelog_test_user',
  pwd: 'tradelog_test_password',
  roles: [{ role: 'readWrite', db: 'tradelog_test' }]
});
