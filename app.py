import gradio as gr
import os

def create_beauty_interface():
    """
    创建美妆智能体交互界面
    """
    
    # 读取 index.html 文件内容
    html_file_path = "index.html"
    if os.path.exists(html_file_path):
        with open(html_file_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
    else:
        html_content = "<h1>美妆智能体交互原型</h1><p>HTML 文件未找到</p>"
    
    # 创建 Gradio 界面
    with gr.Blocks(title="美妆智能体交互原型", theme=gr.themes.Soft()) as demo:
        gr.HTML(html_content)
    
    return demo

if __name__ == "__main__":
    # 创建并启动界面
    demo = create_beauty_interface()
    demo.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False
    )