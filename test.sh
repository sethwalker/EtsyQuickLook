#!/bin/sh

API_KEY=69d58et6t4n4k4rfkfw3xecr
listing_id=$1

#url="http://openapi.etsy.com/v2/public/listings/$listing_id?api_key=$API_KEY"
url="http://openapi.etsy.com/v2/sandbox/public/listings/$listing_id?api_key=$API_KEY"

echo "curl $url"

curl $url
