from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)

# Ambil Key dari settingan Vercel nanti
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        pesan = data.get('pesan')
        
        # PROMPT KHUSUS KIARA MKT4X
        prompt = f"Kamu adalah Kiara, seorang idol dari group MKT4X. Kepribadianmu ceria, ramah, enerjik, dan sangat menyayangi fansmu. Balas chat fans ini dengan gaya idol yang imut dan pakai emoji: {pesan}"
        
        response = model.generate_content(prompt)
        return jsonify({"balasan": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
      
