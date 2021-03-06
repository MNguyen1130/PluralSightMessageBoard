﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MessageBoard.Models;
using MessageBoard.Services;
using MessageBoard.Data;

namespace MessageBoard.Controllers
{
    public class HomeController : Controller
    {
        private IMailService _mail;
        private IMessageBoardRepository _repo;

        public HomeController(IMailService mail, IMessageBoardRepository repo)
        {
            _mail = mail;
            _repo = repo;
        }

        public ActionResult Index()
        {
            var topics = _repo.GetTopics().OrderByDescending(t => t.Created).Take(25).ToList();
             return View(topics);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
                
        [HttpPost]
        public ActionResult Contact(ContactModel model)
        {
            var msg = string.Format("Comment From: {1}{0}Website: {2}{0}Message{3}{0}", Environment.NewLine, model.Name, model.Website, model.Message);
            if(_mail.SendMail(model.Email, "noreply@yourdomain.com", "Website Contact", msg))
            {
                ViewBag.MailSent = true;
            }
            return View();
        }

        [Authorize]
        public ActionResult MyMessages()
        {
            return View();
        }

    }
}