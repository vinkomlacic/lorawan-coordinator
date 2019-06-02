#!/bin/sh
# wait-for-it.sh
# syntax example: wait-for-it.sh localhost sakila johnsmith johnspassword npm start

set -e

host="$1"
database="$2"
username="$3"
password="$4"
shift
cmd="$@"

until MYSQL_PASSWORD=$MYSQL_PASSWORD mysql -h "$host" -D "$database" -u "$username" -p "$password"; do
  >&2 echo "Mysql is unavailable - sleeping"
  sleep 1
done

>&2 echo "Mysql is up - executing command"
exec $cmd