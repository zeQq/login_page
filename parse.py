from html.parser import HTMLParser

class MyParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.recording = False
        self.div_count = 0
        self.output = ""

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == "div" and "relative z-20 flex items-end justify-center h-[500px]" in attrs_dict.get("class", ""):
            self.recording = True
        
        if self.recording:
            if tag == "div":
                self.div_count += 1
            
            attrs_str = " ".join([f'{k}="{v}"' for k, v in attrs])
            self.output += f"<{tag} {attrs_str}>"

    def handle_endtag(self, tag):
        if self.recording:
            self.output += f"</{tag}>"
            if tag == "div":
                self.div_count -= 1
                if self.div_count == 0:
                    self.recording = False

    def handle_data(self, data):
        if self.recording:
            self.output += data

p = MyParser()
with open("page.html", "r", encoding="utf-8") as f:
    p.feed(f.read())

with open("anim_html.html", "w", encoding="utf-8") as f:
    f.write(p.output)
print("Done")