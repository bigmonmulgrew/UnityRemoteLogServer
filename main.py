from flask import Flask, request, jsonify, render_template

import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)  # only show errors, not every request

app = Flask(__name__, template_folder="templates", static_folder="static")

# Store logs in memory
logs = []
maxLogsToStore = 1000  # configurable max

@app.route("/logs", methods=["POST"])
def add_log():
    global logs
    data = request.get_json(force=True)

    if data:
        logs.append(data)

        # Trim if exceeding max
        if len(logs) > maxLogsToStore:
            logs.pop(0)  # remove oldest

        return "OK"
    else:
        return "Invalid log", 400

@app.route("/logs", methods=["GET"])
def get_logs():
    return jsonify(logs)

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)