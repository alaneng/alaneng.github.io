from flask import Flask, request, jsonify, send_from_directory
import pdb

app = Flask(__name__)

@app.route('/datatable')
def datatable():
  datatable = {
    'columns': [
      {"data": "Location"},
      {"data": "Address"},
      {"data": "City"},
      {"data": "State"},
      {"data": "Phone Number"}
    ],
    'data': [
      {
        "location": "Inner Sunset",
        "address": " 1312 18th Ave",
        "city": "San Francisco",
        "state": "California",
        "phone_number": "(415) 242-1205"
      },
      {
        "location": "Disneyland",
        "address": " 1313 Disneyland Dr",
        "city": "Anaheim",
        "state": "California",
        "phone_number": "(714) 781-7277"
      }
    ]
  }

  return jsonify(datatable=datatable)

@app.route('/images/<imageName>')
def image(imageName):
  return send_from_directory('images/', request.path.split('/')[2])

@app.route('/')
def main():
  return send_from_directory('./', 'index.html')

@app.route('/bundle.js')
@app.route('/bootstrap.min.css')
@app.route('/application.css')
def index():
  return app.send_static_file(request.path[1:])


if __name__ == '__main__':
  app.run(debug=True, port=5000)

