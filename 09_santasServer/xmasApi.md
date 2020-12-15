## Happy Xmas API

Create a webserver that reads the xmaslist.json. When Santa visits the root route, the server creates a nice list of gifts with glorious images and delivery instructions.
Design the layout.

No other operations are needed.

xmaslist.json structure is 
```json
[
  {
    "firstname": "Matt",
    "lastname": "River",
    "age": 50,
    "status": "very nice",
    "gifts": [
      {"name": "Teddy", "image": "teddy.png"},
      {"name": "sweets", "image": "sweets.png"}
    ],
    "delivery": "through chimney"
  },
    {
    "firstname": "Mary",
    "lastname": "Smith",
    "age": 10,
    "status": "very nice",
    "gifts": [
      {"name": "Toy car", "image": "car.png"},
      {"name": "Ice cream", "image": "icecream.png"}
    ],
    "delivery": "under the xmas tree"
  }
]
```