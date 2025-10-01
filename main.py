from flask import Flask, request

app = Flask(__name__)

@app.route("/log", methods=["POST"])
def log():
    print("Received:", request.json)
    return "OK"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)