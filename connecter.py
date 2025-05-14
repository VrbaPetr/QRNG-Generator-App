from flask import Flask, request, jsonify
import subprocess
import os
from datetime import datetime

app = Flask(__name__)

# === LOG FUNCTION ===
def log_request(student_id, exam_id, min_val, max_val, result):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    log_dir = os.path.join(base_dir, "logs")
    os.makedirs(log_dir, exist_ok=True)
    log_file_path = os.path.join(log_dir, "requests.log")

    log_line = f"{datetime.now().isoformat()} | student={student_id} | exam={exam_id} | min={min_val} | max={max_val} | result={result}\n"
    with open(log_file_path, "a") as log_file:
        log_file.write(log_line)

@app.route('/generate', methods=['POST'])
def generate_random_number():
    data = request.get_json()

    # params
    try:
        min_val = int(data['min'])
        max_val = int(data['max'])
        student_id = str(data['student'])
        exam_id = str(data['exam'])
    except (KeyError, ValueError):
        return jsonify({'success': False, 'error': 'Wrong or missing parameters.'}), 400

    # directories
    base_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(base_dir, "generated_records", student_id)
    os.makedirs(output_dir, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_filename = f"{exam_id}_{timestamp}.txt"
    output_file = os.path.join(output_dir, output_filename)

    # EasyQuantis command
    command = [
        "EasyQuantis",
        "-p", "0",
        "-n", "1",
        "-i", output_file,
        "--min", str(min_val),
        "--max", str(max_val)
    ]

    try:
        subprocess.run(command, check=True)
        with open(output_file, "r") as f:
            result = f.read().strip()
    except subprocess.CalledProcessError as e:
        return jsonify({'success': False, 'error': f'Cant reach QRNG card: {e}'}), 500
    except Exception as e:
        return jsonify({'success': False, 'error': f'Cant read generated results: {e}'}), 500

    # log
    log_request(student_id, exam_id, min_val, max_val, result)

    return jsonify({
        'success': True,
        'student': student_id,
        'exam': exam_id,
        'result': result
    })

if __name__ == '__main__':
    app.run(debug=True)

