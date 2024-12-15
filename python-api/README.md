# API:

## API Documentation

https://tmp-morning-sun-9892.fly.dev/docs

## /structured-medication

Accessed via a POST request to  https://tmp-morning-sun-9892.fly.dev/structured-medication
With a json body that looks like:
```
{
  "text": "I have 10 cases of 100mg tylenlon extra in deir al balah",
  "store": false | true
}
```

If you `"store": true`, it will save the data to firebase.

Here's a sample command you can input in your terminal to test the api:

curl -X 'POST' \
  'https://tmp-morning-sun-9892.fly.dev/structured-medication' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "text": "I have 10 cases of 100mg tylenlon extra in deir al balah",
  "store": false
}'	

# How to run locally:

1. install mise
1. create a `.env.local` file (path from root of repo `/api/.env.local`)
1. Add the keys to it. You can find the contents of the file in the google doc.
1. `mise trust`, `mise install`, and `mise task run setup`
1. `mise task run dev`


# How to deploy:

1. Check your email for a fly.io invite (I sent an invite to everyone)
1. `brew install flyctl`
1. `fly deploy`
