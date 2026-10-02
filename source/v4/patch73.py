P = "build4.py"
s = open(P).read()
def R(a, b):
    global s
    assert a in s, a[:90]
    s = s.replace(a, b, 1)
R('''<a href="#" class="btn o sm" data-toast="Demande de retouche envoyée à Koffi">Retoucher</a>''', '')
R('\nif __name__ == "__main__":', open("lot73.py").read() + '\n\nif __name__ == "__main__":')
open(P, "w").write(s)
print("ok")
