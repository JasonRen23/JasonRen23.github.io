#coding: utf-8
import os

def git_operation():
	os.system('git add --all')
	os.system('git commit -m ":memo:update blog"')
	os.system('git push')

if __name__ == "__main__":
    git_operation()    # 提交到github仓库
