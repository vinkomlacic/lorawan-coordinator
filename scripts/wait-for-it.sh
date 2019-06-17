#!/bin/sh
# wait-for-it.sh

set -e

host="$1"
mysqlCfgFile="$2"
mysqlCreateScript="$3"
cmd="$4"

echo "Host: $host"
echo "Mysql config file: $mysqlCfgFile"
echo "Mysql create script: $mysqlCreateScript"
echo "Command to be executed: $cmd"

until MYSQL_PASSWORD=$MYSQL_PASSWORD mysql --defaults-extra-file=$cfgFile --host=$host < $mysqlCreateScript; do
  >&2 echo "Mysql is unavailable - sleeping"
  sleep 1
done
echo "Running mysql create script."

>&2 echo "Mysql is up - executing command"
exec $cmd