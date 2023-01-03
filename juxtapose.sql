\echo 'Delete and recreate juxtapose db?'
\prompt 'Return for yes of control-C to cancel > ' foo 

DROP DATABASE juxtapose;
CREATE DATABASE juxtapose;
\connect juxtapose 

\i juxtapose-schema.sql
\i juxtapose-seed.sql 

\echo 'Delete and recreate juxtapose_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo 

DROP DATABASE juxtapose_test;
CREATE DATABASE juxtapose_test;
\connect juxtapose_test

\i juxtapose-schema.sql 