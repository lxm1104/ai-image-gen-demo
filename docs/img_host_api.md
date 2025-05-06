图片托管服务接口文档：
https://documenter.getpostman.com/view/5578104/RWgqUxxh#3f97bade-4020-4039-9ee1-dd778568769c

具体接口
POST
/images/upload
https://api.thecatapi.com/v1/images/upload
Make sure you're using the right field to send the image, and Content-Type header

HEADERS
x-api-key
DEMO-API-KEY

[required] - saves the uploaded image to your account.

Body
formdata
file
sub_id
[optional] - a string you can use to segment your images, e.g. knowing which of your own users uploaded it.

breed_ids
[optional] comma separated string of breed ids contained in the image


Example Request
/images/upload

curl --location 'https://api.thecatapi.com/v1/images/upload' \
--header 'x-api-key: DEMO-API-KEY' \
--form 'file=@"/Users/aden/Dropbox/Mac/Downloads/bl4.jpeg"' \
--form 'sub_id="my-user-1"'

Example Response (body)
{
  "id": "xxBaNrfM0",
  "url": "https://cdn2.thecatapi.com/images/xxBaNrfM0.jpg",
  "sub_id": "my-user-1",
  "width": 480,
  "height": 640,
  "original_filename": "bl4.jpeg",
  "pending": 0,
  "approved": 1
}


API KEY 为：live_Y26DGZV3soTF4ht1P0OxQ3iaHhHw1n1ye10hm9ORAYV1SNarsZr9Bw4XWzcOfAw6