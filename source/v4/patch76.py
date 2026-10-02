P = "build4.py"
s = open(P).read()
def R(a, b):
    global s
    assert a in s, a[:90]
    s = s.replace(a, b, 1)
R('\nif __name__ == "__main__":', '\n' + open("lot76.py").read() + '\n\nif __name__ == "__main__":')
R("html = _fix75(_fix74(_nav_fix(", "html = _fix76(_fix75(_fix74(_nav_fix(")
R(''''href="fatima.html#direct"'))))''', ''''href="fatima.html#direct"')))))''')
open(P, "w").write(s)
print("ok")
