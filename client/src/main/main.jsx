import {
  ArrowRight,
  Search,
  RefreshCw,
  TrendingUp,
  Users,
  Globe,
  MessageCircle,
  Award,
  Plus, Minus, MessageSquare,
  UserPlus,
  Target,
  CalendarDays,
  ArrowLeftRight,
  Sparkles,
} from "lucide-react";

import { useState } from "react";


export default function Main() {

    const [openFAQ, setOpenFAQ] = useState(0);

const faqs = [
  {
    question: "Is SkillSwap completely free?",
    answer:
      "Yes. SkillSwap allows users to exchange skills and connect with learners without any subscription fees.",
  },
  {
    question: "Can I both teach and learn?",
    answer:
      "Absolutely. You can offer skills you know and learn new skills from others.",
  },
  {
    question: "How do I connect with users?",
    answer:
      "Search for skills, view profiles, and send skill exchange requests.",
  },
  {
    question: "Can I schedule sessions?",
    answer:
      "Yes. Users can book and manage learning sessions easily.",
  },
];

const features = [
  {
    icon: Search,
    title: "Discover Skills",
    desc: "Explore user profiles, browse skills, and find people who share your learning interests.",
  },
  {
    icon: UserPlus,
    title: "Send & Accept Requests",
    desc: "Connect with users by sending skill exchange requests and accepting learning opportunities.",
  },
  {
    icon: Target,
    title: "Get Matched",
    desc: "Receive smart recommendations based on your skills, interests, and learning goals.",
  },
  {
    icon: MessageCircle,
    title: "Real-Time Chat",
    desc: "Communicate instantly with your matches and plan learning sessions effortlessly.",
  },
  {
    icon: CalendarDays,
    title: "Book Sessions",
    desc: "Schedule skill-sharing sessions and keep track of upcoming and completed meetings.",
  },
  {
    icon: ArrowLeftRight,
    title: "Exchange Skills",
    desc: "Teach what you know, learn what you need, and build meaningful professional connections.",
  },
];


  return (
    <div className="bg-white min-h-screen">

      {/* NAVBAR */}
      <nav className="sticky top-0 bg-white z-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          <h1 className="text-2xl font-bold text-violet-600">
            SkillSwap
          </h1>

          <div className="hidden md:flex gap-8">
            <a href="#home">Home</a>
            <a href="#how-it-works">Features</a>
            <a href="#features">How It Works</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#faqs">FAQs</a>
          </div>

          <div className="flex gap-3">
            <a
              href="/login"
              className="border px-5 py-2 rounded-lg"
            >
              Log In
            </a>

            <a
              href="/signup"
              className="bg-violet-600 text-white px-5 py-2 rounded-lg"
            >
              Sign Up
            </a>
          </div>
        </div>
      </nav>

  {/* HERO */}

<section
  id="home"
  className="relative overflow-hidden py-10"
>
  {/* Background Blurs */}
  <div className="absolute top-0 left-0 w-96 h-96 bg-violet-300 rounded-full blur-[150px] opacity-20"></div>
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-[150px] opacity-20"></div>

  <div className="max-w-7xl mx-auto px-6">
    <div className="grid lg:grid-cols-2 gap-20 items-center">

      {/* LEFT SIDE */}
      <div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium mb-2">
          <Sparkles size={16} />
          Learn • Teach • Grow 
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold leading-tight text-violet-600">
          SkillSwap
          <br />
          <span className="text-gray-900">
            Grow Together.
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-lg text-gray-600 max-w-xl leading-8">
          Join a thriving community where learners and experts
          connect to share knowledge, build meaningful
          relationships, and accelerate their personal and
          professional growth.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 mt-10">

          <a
            href="/"
            className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-2xl font-medium flex items-center gap-2 transition"
          >
            Get Started
            <ArrowRight size={18} />
          </a>

          <a
            href="#how-it-works"
            className="border border-gray-300 hover:border-violet-500 hover:text-violet-600 px-8 py-4 rounded-2xl font-medium transition"
          >
            Learn More
          </a>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">

          <div className="bg-violet-100 rounded-2xl p-4 shadow-lg">
            <Users
              size={24}
              className="text-violet-600 mb-2"
            />
            <h3 className="font-bold text-xl">
              Connect 
            </h3>
            <p className="text-sm text-gray-500">
              Learners
            </p>
          </div>

          <div className="bg-blue-100 rounded-2xl p-4 shadow-lg">
            <Award
              size={24}
              className="text-blue-600 mb-2"
            />
            <h3 className="font-bold text-xl">
              100%
            </h3>
            <p className="text-sm text-gray-500">
              Free
            </p>
          </div>

          <div className="bg-green-100 rounded-2xl p-4 shadow-lg">
            <Globe
              size={24}
              className="text-green-600 mb-2"
            />
            <h3 className="font-bold text-xl">
              Global
            </h3>
            <p className="text-sm text-gray-500">
              Networks
            </p>
          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="relative">

        {/* Floating Card 2 */}
        <div className="absolute -bottom-6 -right-6 bg-white shadow-xl rounded-2xl px-4 py-3 flex items-center gap-3 z-20">
          <Award
            size={22}
            className="text-green-600"
          />

          <div>
            <p className="font-semibold text-sm">
              Skill Verified
            </p>
            <p className="text-xs text-gray-500">
              Trusted Learning
            </p>
          </div>
        </div>

        {/* Main Image */}
        <div className="relative bg-white p-4 rounded-[40px] shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            alt="SkillSwap Community"
            className="rounded-[30px] w-full h-[550px] object-cover"
          />
        </div>

      </div>

    </div>
  </div>
</section>      

      {/* HOW IT WORKS */}

      <section
  id="how-it-works"
  className="max-w-7xl mx-auto px-6 py-24"
>
  <div className="text-center mb-8">
     <h2 className="text-5xl font-bold">
        Why Coose <span className="text-violet-600">SkillSwap?</span> 
      </h2>

    <p className="text-gray-500 mt-4 text-lg">
      Four simple steps to start your learning journey
    </p>
  </div>

  <div className="grid md:grid-cols-2 gap-6">

    {/* Create Profile */}
    <div className="bg-gradient-to-br from-purple-200 to-purple-150 p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition">
      <Users size={50} className="text-purple-600 mb-5" />

      <h3 className="text-2xl font-bold mb-3">
        Create Profile
      </h3>

      <p className="text-gray-600 leading-7">
        Showcase your expertise and learning interests to connect
        with the right people.
      </p>
    </div>

    {/* Discover */}
    <div className="bg-gradient-to-br from-gray-200 to-gray-50 p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition">
      <Search size={50} className="text-gray-600 mb-5" />

      <h3 className="text-2xl font-bold mb-3">
        Discover
      </h3>

      <p className="text-gray-600 leading-7">
        Explore a diverse community of learners, mentors,
        and professionals.
      </p>
    </div>

    {/* Get Matched */}
    <div className="bg-gradient-to-br from-gray-300 to-gray-150 p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition">
      <TrendingUp size={50} className="text-black mb-5" />

      <h3 className="text-2xl font-bold mb-3">
        Get Matched
      </h3>

      <p className="text-gray-600 leading-7">
        Receive smart recommendations based on your skills
        and learning preferences.
      </p>
    </div>

    {/* Exchange Skills */}
    <div className="bg-gradient-to-br from-blue-200 to-blue-150 p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition">
      <RefreshCw size={50} className="text-blue-600 mb-5" />

      <h3 className="text-2xl font-bold mb-3">
        Exchange Skills
      </h3>

      <p className="text-gray-600 leading-7">
        Teach what you know, learn what you need,
        and grow together through collaboration.
      </p>
    </div>

  </div>
</section>

<section
      id="features"
      className="py-24 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-5">

          <h2 className="text-5xl font-bold">
              How <span className="text-violet-600">SkillSwap</span> Works
          </h2>

          <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
            SkillSwap makes learning and teaching simple,
            effective, and rewarding.
          </p>
        </div>

        {/* Cards */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="bg-violet-100 border border-gray-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-full bg-violet-50 flex items-center justify-center mb-2">
                  <Icon
                    size={32}
                    className="text-violet-600"
                  />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-500 leading-7 mb-6">
                  {feature.desc}
                </p>

              </div>
            );
          })}
        </div>

      </div>
    </section>


      <section id="testimonials" className="py-24 bg-gray-50">

  <div className="max-w-7xl mx-auto px-6">

    <div className="text-center mb-8">

      <h2 className="text-5xl font-bold">
         <span className="text-violet-600"> Reviews</span>  speak volumes.
      </h2>

      <p className="text-gray-500 text-lg mt-2">
        Don't just take our word for it. Hear what learners have to say.
      </p>

    </div>

  <div className="grid lg:grid-cols-3 gap-8 mt-8">

  {[
   {
  role: "Aspiring Web Developer",
  name: "Neha Gupta",
  bg: "bg-violet-100",
  review:
    "SkillSwap helped me transition from learning tutorials to building real projects. The personalized guidance and skill-sharing sessions accelerated my growth as a developer."
},
{
  role: "Software Engineer",
  name: "Arjun Patel",
  bg: "bg-gray-200",
  review:
    "I loved being able to teach Node.js while learning system design from experienced professionals. The exchange-based learning model is both unique and highly effective."
},
{
  role: "Data Analyst",
  name: "Abhishek Kapoor",
  bg: "bg-blue-100",
  review:
    "The community is incredibly supportive. Through SkillSwap, I learned Python, SQL, and data visualization techniques that directly helped me perform better in my job."
}
  ].map((item, index) => (
    <div
      key={index}
      className={`${item.bg} rounded-[32px] p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden`}
    >


<p className="text-gray-700 leading-8 italic">
  <span className="text-violet-600 font-bold text-xl mr-1">"</span>
  {item.review}
  <span className="text-violet-600 font-bold text-xl ml-1">"</span>
</p>

      {/* Rating */}
      <div className="flex gap-1 text-yellow-500 text-xl mt-1">
        ★★★★★
      </div>

      {/* User */}
      <div className="border-t border-black/10 mt-1 pt-5 flex items-center gap-4">
        <img
          src={`https://i.pravatar.cc/100?img=${index + 10}`}
          alt=""
          className="w-14 h-14 rounded-full"
        />

        <div>
          <h4 className="font-bold">
            {item.name}
          </h4>

          <p className="text-gray-600 text-sm">
            {item.role}
          </p>
        </div>
      </div>

    </div>
  ))}
</div>

  </div>

</section>


      <section
  id="faqs"
  className="bg-[#f8f8f6] py-24 relative overflow-hidden"
>
  <div className="max-w-7xl mx-auto px-6">

    <div className="grid lg:grid-cols-[1.8fr_1fr] gap-10">

      {/* Left Side */}
      <div>

        <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-14">
          Frequently
          <br />
          asked questions
        </h2>

        <div className="space-y-4">

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-violet-200 border border-gray-200 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenFAQ(openFAQ === index ? null : index)
                }
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-lg">
                  {faq.question}
                </span>

                {openFAQ === index ? (
                  <Minus size={24} />
                ) : (
                  <Plus size={24} />
                )}
              </button>

              {openFAQ === index && (
                <div className="px-6 pb-6 text-gray-600 leading-8">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}

        </div>

      </div>

      {/* Right Side Card */}
      <div>

        <div className="bg-white border border-gray-200 rounded-3xl p-10 ">

          <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-8">
            <MessageSquare
              size={36}
              className="text-white"
            />
          </div>

          <h3 className="text-3xl font-bold text-center">
            Do you have more questions?
          </h3>

          <p className="text-gray-600 text-center mt-5 leading-8">
            Need help finding the right skill partner?
            Reach out to us and we'll help you get started.
          </p>

          <a
            href="mailto:skillswap994@gmail.com"
            className="block mt-10 bg-violet-500 hover:bg-violet-700 text-white text-center py-4 rounded-xl font-medium transition"
          >
            Contact Support
          </a>

        </div>

      </div>

    </div>

  </div>


        <div className="max-w-7xl mx-auto px-6">
          <div className="mt-8 bg-violet-100 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">

          <div className="flex items-center gap-5">

            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">

              <Users

                size={30}

                className="text-violet-600"

              />

            </div>



            <div>

              <h3 className="text-2xl font-bold text-gray-900">

                Ready to start your learning journey?

              </h3>



              <p className="text-gray-500 mt-2">

                Join thousands of learners and educators

                already swapping skills and building their

                future together.

              </p>

            </div>

          </div>



          <button className="bg-violet-600 hover:bg-violet-700 text-white px-8 py-4 rounded-xl font-medium flex items-center gap-2 transition">

            <a href="/">Get Started for Free</a>

            <ArrowRight size={18} />

          </button>

        </div>
      </div>

</section>

    </div>
  );
}